import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouriteTherapistDto } from 'src/app/core/dtos/favouriteTherapistDto';
import { FavouriteTherapist } from 'src/app/core/models/favouriteTherapist';
import { Schedule } from 'src/app/core/models/schedule';
import { TherapistFee } from 'src/app/core/models/therapistFee';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { FavouriteTherapistsService } from 'src/app/core/services/favouriteTherapists.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
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
  isFavTherapist: boolean;
  favTherapist: FavouriteTherapistDto;

  constructor(
    private route: ActivatedRoute,
    private usersSer: UsersService,
    private alertify: AlertService,
    private therapistFeesSer: TherapistfeesService,
    private router: Router,
    private mainRepo: RepositoryService,
    private favTherapistsSer: FavouriteTherapistsService
  ) { }

  ngOnInit() {
    this.imgUrl = '../../../assets/therapists/';
  }

  ionViewWillEnter() {
    this.userId = Number(this.route.snapshot.params.id);
    this.isFavTherapist = false;
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
      this.favTherapistsSer.favByTherapist_id(this.mainRepo.loggedInUser.id, this.userId)
      .subscribe((res: FavouriteTherapistDto) => {
        this.favTherapist = res;
        if (this.favTherapist) {
          this.isFavTherapist = true;
        }
      });
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
    this.router.navigate([this.mainRepo.previousUrl]);
  }

  onFavouriteBtnClicked(): void {
    if (this.isFavTherapist) { // make un favourite
      this.favTherapistsSer.deleteFavTherapist(this.favTherapist.id)
      .subscribe((res: void) => {
        this.isFavTherapist = false;
      }, error => {
        this.alertify.presentAlert('Error', error);
      })
    } else {
      const model = new FavouriteTherapist();
      model.client = this.mainRepo.loggedInUser.id;
      model.therapist = this.therapist.id;
      this.favTherapistsSer.createFavTherapist(model)
      .subscribe((res: FavouriteTherapist) => {
        this.isFavTherapist = true;
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    }
  }

  get starColor(): string {
    let res = '';
    if (this.isFavTherapist) {
      res = 'warning';
    }
    return res;
  }
}
