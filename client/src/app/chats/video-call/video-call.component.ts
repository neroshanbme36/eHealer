import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/core/models/appointment';
import { Session } from 'src/app/core/models/session';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { WebrtcService } from '../../core/services/webrtc.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  appointment?: Appointment;
  appointmentId: number;

  topVideoFrame = 'partner-video';
  userId: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private mainRepo: RepositoryService,
    private appointmentsSer: AppointmentsService,
    private alertify: AlertService
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.queryParams.appointmentId;
    this.userId = this.mainRepo.loggedInUser.id.toString();
    this.partnerId = this.route.snapshot.params.id;
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    this.myEl.volume = 0;
    this.login();
  }

  ionViewWillEnter() {
    if (this.mainRepo.loggedInUser.roleType === 'therapist') {
      this.webRTC.isTherapist = true;
      this.appointmentsSer.getAppoitment(this.appointmentId)
      .subscribe((res: Appointment) => {
        this.appointment = res;
      }, error => {
        this.alertify.presentAlert('Error', error);
      }, () => {
        this.webRTC.session = new Session(
          1, '', this.appointment.id, this.appointment.client, this.appointment.therapist, null
        );
      });
    }
  }

  ionViewDidLeave() {
    this.webRTC.stopBothVideoAndAudio();
  }

  login() {
    this.webRTC.init(this.userId, this.myEl, this.partnerEl);
  }

  call() {
    this.webRTC.call(this.partnerId);
    this.swapVideo('my-video');
  }

  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }

  close() {
    if (this.webRTC.isRecording && this.webRTC.isTherapist) {
      console.log('stopping');
      this.webRTC.stopRecording();
    } else {
      this.router.navigate([this.mainRepo.previousUrl]);
    }
    // this.webRTC.stopBothVideoAndAudio();
    // this.router.navigate([this.mainRepo.previousUrl]);
  }
}
