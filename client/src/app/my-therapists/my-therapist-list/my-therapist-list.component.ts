import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavouriteTherapistDto } from 'src/app/core/dtos/favouriteTherapistDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { FavouriteTherapistsService } from 'src/app/core/services/favouriteTherapists.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-my-therapist-list',
  templateUrl: './my-therapist-list.component.html',
  styleUrls: ['./my-therapist-list.component.scss']
})
export class MyTherapistListComponent implements OnInit {
  therapists?: User[];
  searchTherapistName: string;
  searchSpecialization: string;
  imgUrl: string;

  constructor(
    private favTherapistsSer: FavouriteTherapistsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchTherapistName = '';
    this.searchSpecialization = '';
    this.imgUrl = '../../../assets/therapists/';
  }

  ionViewWillEnter() {
    this.therapists = [];
    this.searchTherapistName = '';
    this.searchSpecialization = '';
    this.bindFavTherapists();
  }

  private bindFavTherapists() {
    this.favTherapistsSer.getFavTherapistByClientId(this.mainRepo.loggedInUser.id)
    .subscribe((res: FavouriteTherapistDto[]) => {
      this.therapists = res.map(x => x.therapist);
      console.log(this.therapists);
    }, error => {
      this.alertify.presentAlert('Error', error);
    })
  }

  get filteredTherapists(): User[] {
    if (this.searchTherapistName === '' && this.searchSpecialization === '') {
      return this.therapists;
    } else if (this.searchTherapistName !== '' && this.searchSpecialization === '') {
      return this.therapists.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
      .includes(this.searchTherapistName));
    } else if (this.searchTherapistName === '' && this.searchSpecialization !== '') {
      return this.therapists.filter(x => x.specialization.trim().toLowerCase()
      .includes(this.searchSpecialization.trim().toLowerCase()));
    } else {
      return this.therapists.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
      .includes(this.searchTherapistName) && x.specialization.trim().toLowerCase()
      .includes(this.searchSpecialization.trim().toLowerCase()));
    }
  }

  onViewTherapistBtnClicked(therapist: User): void {
    this.router.navigate(['echannel/therapist_profile', therapist.id]);
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
    this.router.navigate(['/home']);
  }
}
