import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '@core/services/toast.service';
import { ConfirmationService } from '@shared/services/confirmation.service';

import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/forms/input/input.component';
import { SocketService } from '../../services/socket.service';
import { BehaviorSubject, Subject, takeUntil, of } from 'rxjs';

interface Participant {
  id: string;
  stream: MediaStream;
  isLocal: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

@Component({
  selector: 'app-meeting-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    NgSelectModule,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <div class="meeting-container">
      <mat-sidenav-container>
        <mat-sidenav-content>
          <!-- Participants Grid -->
          <div class="participants-grid">
            @for (participant of participants$ | async; track participant.id) {
              <div class="participant-video">
                <video
                  [srcObject]="participant.stream"
                  [muted]="participant.isLocal"
                  autoplay
                  playsinline
                ></video>
                <div class="participant-controls">
                  <app-button
                    [icon]="participant.audioEnabled ? 'mic' : 'mic_off'"
                    (click)="toggleAudio(participant)"
                  ></app-button>
                  <app-button
                    [icon]="participant.videoEnabled ? 'videocam' : 'videocam_off'"
                    (click)="toggleVideo(participant)"
                  ></app-button>
                </div>
              </div>
            }
          </div>

          <!-- Meeting Controls -->
          <div class="meeting-controls">
            <app-button
              [icon]="localAudioEnabled ? 'mic' : 'mic_off'"
              (click)="toggleLocalAudio()"
            ></app-button>
            <app-button
              [icon]="localVideoEnabled ? 'videocam' : 'videocam_off'"
              (click)="toggleLocalVideo()"
            ></app-button>
            <app-button
              [icon]="screenSharing ? 'stop_screen_share' : 'screen_share'"
  
              (click)="toggleScreenShare()"
            ></app-button>
            <app-button
              [icon]="showRightPanel ? 'chevron_right' : 'chevron_left'"
              (click)="toggleRightPanel()"
            ></app-button>
            <app-button
              icon="call_end"
  
              class="leave-btn"
              (click)="confirmLeaveMeeting()"
            ></app-button>
          </div>
        </mat-sidenav-content>

        <mat-sidenav position="end" mode="side" [opened]="showRightPanel">
          <div class="right-panel">
            <div class="panel-header">
              <app-button
                [variant]="activeTab === 'chat' ? 'primary' : 'secondary'"
                (click)="activeTab = 'chat'"
              >
                Chat
              </app-button>
              <app-button
                [variant]="activeTab === 'participants' ? 'primary' : 'secondary'"
                (click)="activeTab = 'participants'"
              >
                Participants
              </app-button>
            </div>

            @if (activeTab === 'chat') {
              <div class="chat-container">
                <div class="messages">
                  @for (message of chatMessages; track message.id) {
                    <div class="message" [class.own-message]="message.senderId === currentUserId">
                      <div class="sender">{{ message.senderName }}</div>
                      <div class="content">{{ message.content }}</div>
                      <div class="timestamp">{{ message.timestamp | date:'shortTime' }}</div>
                    </div>
                  }
                </div>
                <div class="chat-input">
                  <app-input
                    [(ngModel)]="newMessage"
                    (keyup.enter)="sendMessage()"
                    placeholder="Type a message..."
                  ></app-input>
                  <app-button
                    icon="send"
    
                    (click)="sendMessage()"
                  ></app-button>
                </div>
              </div>
            }

            @if (activeTab === 'participants') {
              <div class="participants-list">
                @for (participant of participants$ | async; track participant.id) {
                  <div class="participant-item">
                    <mat-icon>person</mat-icon>
                    <span>{{ participant.isLocal ? 'You' : 'Participant ' + participant.id }}</span>
                    <div class="participant-status">
                      <mat-icon [class.disabled]="!participant.audioEnabled">mic</mat-icon>
                      <mat-icon [class.disabled]="!participant.videoEnabled">videocam</mat-icon>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </mat-sidenav>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }

    .meeting-container {
      height: 100%;
      width: 100%;
    }

    mat-sidenav-container {
      height: 100%;
    }

    mat-sidenav {
      width: 300px;
    }

    .right-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-bottom: 1px solid var(--border-color);

      app-button {
        flex: 1;
      }
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .message {
      margin-bottom: 16px;
      max-width: 80%;

      &.own-message {
        margin-left: auto;
        .content {
          background: var(--primary-color);
          color: white;
        }
      }
    }

    .chat-input {
      padding: 16px;
      display: flex;
      gap: 8px;
      border-top: 1px solid var(--border-color);

      app-input {
        flex: 1;
      }
    }

    .participants-list {
      padding: 16px;
    }

    .participant-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-bottom: 1px solid var(--border-color);

      .participant-status {
        margin-left: auto;
        display: flex;
        gap: 4px;

        .disabled {
          opacity: 0.5;
        }
      }
    }

    .leave-btn {
      --button-bg-color: var(--error-color);
      --button-hover-bg-color: var(--error-hover-color);
    }
  `]
})
export class MeetingRoomComponent implements OnInit, OnDestroy {
  private socketService = inject(SocketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private destroy$ = new Subject<void>();

  participants$ = new BehaviorSubject<Participant[]>([]);
  localStream?: MediaStream;
  screenStream?: MediaStream;
  localAudioEnabled = true;
  localVideoEnabled = true;
  screenSharing = false;

  showRightPanel = true;
  activeTab: 'chat' | 'participants' = 'chat';
  chatMessages: any[] = [];
  newMessage = '';
  currentUserId = 'current-user'; // This should come from your auth service

  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private socketConnected = false;

  async ngOnInit() {
    const meetingId = this.route.snapshot.params['id'];
    if (!meetingId) {
      await this.router.navigate(['/app/meetings']);
      return;
    }

    try {
      await this.initializeLocalStream();
      await this.joinMeeting(meetingId);
      this.setupSocketListeners(meetingId);
    } catch (error) {
      console.error('Failed to initialize meeting:', error);
      this.toastService.show('Could not initialize audio/video. Please check your device permissions and try again.', 'error');
      await this.router.navigate(['/app/meetings']);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }

  private setupSocketListeners(meetingId: string) {
    // Handle socket connection
    of(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.socketConnected = true;
          this.socketService.emit('join-meeting', { meetingId, userId: this.currentUserId });
        },
        error: (error) => {
          console.error('Socket connection failed:', error);
          this.handleConnectionError();
        }
      });

    // Handle new participant joining
    this.socketService.on('participant-joined')
      .pipe(takeUntil(this.destroy$))
      .subscribe(async ({ userId }) => {
        await this.handleNewParticipant(userId);
      });

    // Handle participant leaving
    this.socketService.on('participant-left')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userId }) => {
        this.handleParticipantLeft(userId);
      });

    // Handle chat messages
    this.socketService.on('chat-message')
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        this.chatMessages.push(message);
      });
  }

  private async handleNewParticipant(userId: string) {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    this.peerConnections.set(userId, peerConnection);

    // Add local tracks to the peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          peerConnection.addTrack(track, this.localStream);
        }
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit('ice-candidate', {
          userId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote tracks
    peerConnection.ontrack = (event) => {
      const participants = this.participants$.value;
      const existingParticipant = participants.find(p => p.id === userId);
      
      if (!existingParticipant) {
        participants.push({
          id: userId,
          stream: event.streams[0],
          isLocal: false,
          audioEnabled: true,
          videoEnabled: true
        });
        this.participants$.next(participants);
      }
    };

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      this.socketService.emit('offer', { userId, offer });
    } catch (error) {
      console.error('Error creating offer:', error);
      this.handleConnectionError();
    }
  }

  private async handleParticipantLeft(userId: string) {
    const peerConnection = this.peerConnections.get(userId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(userId);
    }

    const participants = this.participants$.value.filter(p => p.id !== userId);
    this.participants$.next(participants);
  }

  private handleConnectionError() {
    this.toastService.show('Lost connection to the meeting. Attempting to reconnect...', 'error');
    
    // Attempt to reconnect after 3 seconds
    setTimeout(() => {
      if (!this.socketConnected) {
        this.socketService.connect();
      }
    }, 3000);
  }

  private async joinMeeting(meetingId: string) {
    if (!this.localStream) {
      throw new Error('Local stream not initialized');
    }

    // Setup socket connection and join the meeting room
    this.socketService.emit('join-meeting', {
      meetingId,
      userId: this.currentUserId
    });
  }

  async toggleLocalAudio() {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      this.localAudioEnabled = !this.localAudioEnabled;
    }
  }

  async toggleLocalVideo() {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      this.localVideoEnabled = !this.localVideoEnabled;
    }
  }

  async toggleScreenShare() {
    if (this.screenSharing) {
      this.stopScreenSharing();
    } else {
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        this.screenSharing = true;
        // Implementation of screen sharing
      } catch (error) {
        console.error('Error sharing screen:', error);
        this.toastService.show('Could not start screen sharing. Please try again.', 'error');
      }
    }
  }

  private stopScreenSharing() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = undefined;
      this.screenSharing = false;
    }
  }

  toggleRightPanel() {
    this.showRightPanel = !this.showRightPanel;
  }

  async toggleAudio(participant: Participant) {
    // Only toggle audio for remote participants
    if (!participant.isLocal) {
      const audioTracks = participant.stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      
      // Update the participant's audioEnabled state
      const updatedParticipants = this.participants$.value.map(p => 
        p.id === participant.id 
          ? { ...p, audioEnabled: !p.audioEnabled } 
          : p
      );
      
      this.participants$.next(updatedParticipants);
      
      // Optionally, emit a socket event to notify other participants
      this.socketService.emit('toggle-participant-audio', {
        participantId: participant.id,
        audioEnabled: !participant.audioEnabled
      });
    }
  }

  async toggleVideo(participant: Participant) {
    // Only toggle video for remote participants
    if (!participant.isLocal) {
      const videoTracks = participant.stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      
      // Update the participant's videoEnabled state
      const updatedParticipants = this.participants$.value.map(p => 
        p.id === participant.id 
          ? { ...p, videoEnabled: !p.videoEnabled } 
          : p
      );
      
      this.participants$.next(updatedParticipants);
      
      // Optionally, emit a socket event to notify other participants
      this.socketService.emit('toggle-participant-video', {
        participantId: participant.id,
        videoEnabled: !participant.videoEnabled
      });
    }
  }

  sendMessage() {
    if (!this.newMessage) return;
    
    const message = {
      id: crypto.randomUUID(),
      content: this.newMessage,
      senderId: this.currentUserId,
      senderName: 'You',
      timestamp: new Date()
    };

    this.chatMessages.push(message);
    this.socketService.emit('chat-message', {
      ...message,
      meetingId: this.route.snapshot.params['id']
    });
    this.newMessage = '';
  }

  confirmLeaveMeeting() {
    this.confirmationService
      .confirm({
        title: 'Leave Meeting',
        body: 'Are you sure you want to leave this meeting?',
        confirm: 'Leave',
        cancel: 'Stay',
        confirmVariant: 'error',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.leaveMeeting();
        }
      });
  }

  private async leaveMeeting() {
    this.cleanup();
    await this.router.navigate(['/app/meetings']);
  }

  private async initializeLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Add local participant
      this.participants$.next([
        {
          id: this.currentUserId,
          stream: this.localStream,
          isLocal: true,
          audioEnabled: true,
          videoEnabled: true,
        },
      ]);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  private cleanup() {
    // Stop all media tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
    }
    
    // Close all peer connections
    this.peerConnections.forEach((connection) => {
      connection.close();
    });
    this.peerConnections.clear();
    
    // Clear participants
    this.participants$.next([]);
    
    // Disconnect socket
    if (this.socketConnected) {
      this.socketService.disconnect();
      this.socketConnected = false;
    }
  }
}
