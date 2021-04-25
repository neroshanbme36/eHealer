import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Peer from 'peerjs';
import { Session } from '../models/session';
import { AlertService } from './alert.service';
import { RepositoryService } from './repository.service';
import { SessionsService } from './sessions.service';

const constraints: MediaStreamConstraints = { video: true, audio: false };

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  isTherapist: boolean;
  session?: Session;

  peer: Peer;
  myStream: MediaStream;
  partnerStream: MediaStream;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  stun = 'stun.l.google.com:19302';
  mediaConnection: Peer.MediaConnection;
  options: Peer.PeerJSOption;
  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun,
  };

  // recordings
  recordedBlobs: Blob[];
  mediaRecorder: MediaRecorder;
  // downloadUrl: string;
  isRecording: boolean;

  constructor(
    private sessionSer: SessionsService,
    private alertify: AlertService,
    private router: Router,
    private mainRepo: RepositoryService
  ) {
    this.options = {  // not used, by default it'll use peerjs server
      key: 'cd1ft79ro8g833di',
      debug: 3
    };
    this.isRecording = false;
    this.isTherapist = false;
  }

  private getMedia() {
    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      this.handleSuccess(stream);
    }, (error) => {
      this.handleError(error);
    });
  }

  stopBothVideoAndAudio() {
    this.myStream.getTracks().forEach(track => {
      if (track.readyState === 'live') {
        track.stop();
      }
    });
  }

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement) {
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    try {
      this.getMedia();
    } catch (e) {
      this.handleError(e);
    }
    await this.createPeer(userId);
  }

  async createPeer(userId: string) {
    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.wait();
    });
  }

  call(partnerId: string) {
    const call = this.peer.call(partnerId, this.myStream);
    console.log(call);
    call.on('stream', (stream) => {
      this.partnerStream = stream;
      this.partnerEl.srcObject = stream;
      if (!this.isRecording && this.isTherapist) {
        this.startRecording();
      }
    });
  }

  wait() {
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => {
        this.partnerStream = stream;
        this.partnerEl.srcObject = stream;
        if (!this.isRecording && this.isTherapist) {
          this.startRecording();
        }
      });
    });
  }

  private handleSuccess(stream: MediaStream) {
    this.myStream = stream;
    this.myEl.srcObject = stream;
  }

  private handleError(error: any) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
      // this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
      this.errorMsg(`The resolution px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
      this.errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    this.errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  private errorMsg(msg: string, error?: any) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  // Recording
  startRecording() {
    this.recordedBlobs = [];
    const options: MediaRecorderOptions = { mimeType: 'video/webm' };

    try {
      this.mediaRecorder = new MediaRecorder(this.partnerStream, options);
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start();
    this.isRecording = !this.isRecording;
    // on data available events
    try {
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
    // on stop event
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        if (this.recordedBlobs || this.recordedBlobs.length) {
          const videoBuffer = new Blob(this.recordedBlobs, { type: 'video/webm' });
          // this.downloadUrl = window.URL.createObjectURL(videoBuffer);
          this.session.file = new File([videoBuffer], this.session.appointment + '.webm', { type: videoBuffer.type });
          // calling api here since the method is async
          this.sessionSer.createSession(this.session)
            .subscribe((res: Session) => {
              console.log(res);
              this.router.navigate([this.mainRepo.previousUrl]);
            }, error => {
              this.alertify.presentAlert('Error', error);
            });
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    console.log('Recorded Blobs: ', this.recordedBlobs);
  }
}
