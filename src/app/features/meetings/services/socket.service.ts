import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;
  private participants = new BehaviorSubject<string[]>([]);
  private mediaStateChanged = new BehaviorSubject<any>({});

  readonly participants$ = this.participants.asObservable();
  readonly mediaStateChanged$ = this.mediaStateChanged.asObservable();

  private peerConnections = new Map<string, RTCPeerConnection>();

  constructor() {
    this.socket = io(environment.wsUrl);
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('participant-joined', (participantId: string) => {
      this.participants.next([...this.participants.value, participantId]);
    });

    this.socket.on('participant-left', (participantId: string) => {
      this.participants.next(
        this.participants.value.filter((id) => id !== participantId)
      );
    });

    this.socket.on('offer', async ({ from, offer }) => {
      const peerConnection = this.getPeerConnection(from);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      this.socket.emit('answer', { to: from, answer });
    });

    this.socket.on('answer', async ({ from, answer }) => {
      const peerConnection = this.getPeerConnection(from);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socket.on('ice-candidate', async ({ from, candidate }) => {
      const peerConnection = this.getPeerConnection(from);
      if (candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    this.socket.on('audio-state-changed', ({ participantId, enabled }) => {
      this.mediaStateChanged.next({ type: 'audio', participantId, enabled });
    });

    this.socket.on('video-state-changed', ({ participantId, enabled }) => {
      this.mediaStateChanged.next({ type: 'video', participantId, enabled });
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    return this.socket.on(event, callback);
  }

  emit(event: string, ...args: any[]) {
    return this.socket.emit(event, ...args);
  }

  private getPeerConnection(participantId: string): RTCPeerConnection {
    if (!this.peerConnections.has(participantId)) {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('ice-candidate', {
            to: participantId,
            candidate: event.candidate,
          });
        }
      };

      this.peerConnections.set(participantId, peerConnection);
    }

    return this.peerConnections.get(participantId)!;
  }

  async createOffer(participantId: string) {
    const peerConnection = this.getPeerConnection(participantId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    this.socket.emit('offer', { to: participantId, offer });
  }

  joinRoom(roomId: string) {
    this.socket.emit('join-room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leave-room', roomId);
    // Clean up peer connections
    this.peerConnections.forEach((connection) => connection.close());
    this.peerConnections.clear();
  }

  disconnect() {
    this.socket.disconnect();
    this.peerConnections.forEach((connection) => connection.close());
    this.peerConnections.clear();
    this.participants.next([]);
  }

  // ... more socket methods
}
