import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

@Injectable({ providedIn: 'root' })
export class WebRTCService {
  private peerConnections = new Map<string, PeerConnection>();
  private localStream = new BehaviorSubject<MediaStream | null>(null);
  private screenStream = new BehaviorSubject<MediaStream | null>(null);

  readonly localStream$ = this.localStream.asObservable();
  readonly screenStream$ = this.screenStream.asObservable();

  async initializeLocalStream(video: boolean = true, audio: boolean = true) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      });
      this.localStream.next(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async startScreenShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      this.screenStream.next(stream);
      return stream;
    } catch (error) {
      console.error('Error sharing screen:', error);
      throw error;
    }
  }

  createPeerConnection(peerId: string): RTCPeerConnection {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers for production
      ],
    };

    const connection = new RTCPeerConnection(config);
    this.peerConnections.set(peerId, { id: peerId, connection });

    return connection;
  }

  // ... more WebRTC methods
}
