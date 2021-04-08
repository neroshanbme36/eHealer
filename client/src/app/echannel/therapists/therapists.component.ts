import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { UsersService } from 'src/app/core/services/users.service';
import { EchannelService } from '../echannel.service';
import { FilterTherapistsComponent } from './filter-therapists/filter-therapists.component';

@Component({
  selector: 'app-therapists',
  templateUrl: './therapists.component.html',
  styleUrls: ['./therapists.component.scss']
})
export class TherapistsComponent implements OnInit {
  therapists: User[];
  imgUrl = '';

  constructor(
    private usersSer: UsersService,
    private alertify: AlertService,
    private router: Router,
    public modalController: ModalController,
    private echannelSer: EchannelService
  ) { }

  ngOnInit() {
    this.therapists = [];
    this.bindTherapists();
    this.imgUrl = '../../../assets/therapists/';
  }

  private bindTherapists(): void {
    this.usersSer.getUsersByRole('therapist', 'True')
    .subscribe((res: User[]) => {
      if (res) {
        this.therapists = res;
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  get filteredTherapists(): User[] {
    if (this.echannelSer.searchTherapistName === '' && this.echannelSer.searchSpecialization === '') {
      return this.therapists;
    } else if (this.echannelSer.searchTherapistName !== '' && this.echannelSer.searchSpecialization === '') {
      return this.therapists.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
      .includes(this.echannelSer.searchTherapistName));
    } else if (this.echannelSer.searchTherapistName === '' && this.echannelSer.searchSpecialization !== '') {
      return this.therapists.filter(x => x.specialization.trim().toLowerCase()
      .includes(this.echannelSer.searchSpecialization.trim().toLowerCase()));
    } else {
      return this.therapists.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
      .includes(this.echannelSer.searchTherapistName) && x.specialization.trim().toLowerCase()
      .includes(this.echannelSer.searchSpecialization.trim().toLowerCase()));
    }
  }

  onViewTherapistPrf(therapist: User): void {
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
    this.router.navigate(['home']);
  }
}
