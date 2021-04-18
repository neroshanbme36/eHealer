import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { WebrtcService } from '../../core/services/webrtc.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit, AfterViewInit {

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
    private mainRepo: RepositoryService
  ) {}

  ngOnInit(): void {
    this.userId = this.mainRepo.loggedInUser.username;
    this.partnerId = this.route.snapshot.params.id;
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    this.myEl.volume = 0;
    this.login();
  }

  ngAfterViewInit(): void {
    // this.call();
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
    this.router.navigate([this.mainRepo.previousUrl]);
  }

}
