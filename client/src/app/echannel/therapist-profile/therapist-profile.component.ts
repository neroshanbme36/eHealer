import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule } from 'src/app/core/models/schedule';
import { TherapistFee } from 'src/app/core/models/therapistFee';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { SchedulesService } from 'src/app/core/services/schedules.service';
import { TherapistfeesService } from 'src/app/core/services/therapistfees.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-therapist-profile',
  templateUrl: './therapist-profile.component.html',
  styleUrls: ['./therapist-profile.component.scss']
})
export class TherapistProfileComponent implements OnInit {
  userId: number;
  therapist?: User;
  therpaistFee?: TherapistFee;
  imgUrl = '';

  constructor(
    private route: ActivatedRoute,
    private usersSer: UsersService,
    private alertify: AlertService,
    private therapistFeesSer: TherapistfeesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.imgUrl = '../../../assets/therapists/';
  }

  ionViewWillEnter() {
    this.userId = Number(this.route.snapshot.params.id);
    this.bindTherapistDetails();
  }

  bindTherapistDetails(): void {
    this.usersSer.getUser(this.userId)
    .subscribe((res: User) => {
      this.therapist = res;
    }, error => {
      this.alertify.presentAlert('Error', error);
    }, () => {
      this.therapistFeesSer.getTherapistFeeUserId(this.userId)
      .subscribe((res: TherapistFee) => {
        this.therpaistFee = res;
      }, error => {
        this.alertify.presentAlert('Error', error);
      }, () => {});
    });
  }

  onBookAnAppointmentBtnClicked(): void {
    this.router.navigate(['echannel/book_an_appointment', this.userId]);
  }

  getImg(gender: string): string {
    if (gender === 'male') {
      return 'male.png';
    } else if (gender === 'female'){
      return 'female.png';
    } else {
      return 'other.png';
    }
  }
  back(): void {
    this.router.navigate(['echannel/therapists']);
  }
}
