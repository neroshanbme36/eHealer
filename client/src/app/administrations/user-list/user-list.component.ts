import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users?: User[];
  searchByFullName: string;
  searchSpecialization: string;
  imgTherapistUrl: string;
  imgClientUrl: string;
  searchByRoleType: string; // ui all,therapist,client
  searchByIsActive: string; // ui all,yes,no

  constructor(
    private usersSer: UsersService,
    private alertify: AlertService,
    private router: Router,
    private mainRepo: RepositoryService
  ) { }

  ngOnInit() {
    this.searchByFullName = '';
    this.searchSpecialization = '';
    this.searchByRoleType = 'all';
    this.searchByIsActive = 'all';
    this.imgTherapistUrl = '../../../assets/therapists/';
    this.imgClientUrl = '../../../assets/images/';
  }

  ionViewWillEnter() {
    this.users = [];
    this.bindUsers();
  }

  private bindUsers(): void {
    this.usersSer.getUsers().subscribe((res: User[]) => {
      this.users = res;
      this.users = this.users.filter(x => x.roleType.trim().toLowerCase() !== 'admin');
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  get filteredUsers(): User[] {
    let fUsers = [];
    Object.assign(fUsers, this.users);
    if (this.searchByRoleType.trim().toLowerCase() !== 'all') {
      fUsers = fUsers.filter(x => x.roleType.trim().toLowerCase() === this.searchByRoleType.trim().toLowerCase());
    }
    if (this.searchByIsActive.trim().toLowerCase() !== 'all') {
      let isActive = this.searchByIsActive.trim().toLowerCase() === 'yes' ? true : false;
      fUsers = fUsers.filter(x => x.isActive === isActive);
    }
    if (this.searchByFullName === '' && this.searchSpecialization === '') {
      return fUsers;
    } else if (this.searchByFullName !== '' && this.searchSpecialization === '') {
      return fUsers.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
      .includes(this.searchByFullName));
    } else if (this.searchByFullName === '' && this.searchSpecialization !== '') {
      return fUsers.filter(x => x.specialization.trim().toLowerCase()
      .includes(this.searchSpecialization.trim().toLowerCase()));
    } else {
      return fUsers.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
      .includes(this.searchByFullName) && x.specialization.trim().toLowerCase()
      .includes(this.searchSpecialization.trim().toLowerCase()));
    }
  }

  onViewUserBtnClicked(user: User): void {
    this.router.navigate(['administrations/user_edit', user.id]);
  }

  getImg(gender: string, roleType: string): string {
    if (roleType.trim().toLowerCase() === 'therapist') {
      if (gender === 'male') {
        return this.imgTherapistUrl + 'male.png';
      } else if (gender === 'female'){
        return this.imgTherapistUrl + 'female.png';
      } else {
        return this.imgTherapistUrl + 'other.png';
      }
    } else {
      this.imgClientUrl = '../../../assets/images/';
      if (gender === 'male') {
        return this.imgClientUrl +'client-male.png';
      } else if (gender === 'female'){
        return this.imgClientUrl + 'client-female.png';
      } else {
        return this.imgClientUrl + 'client-other.png';
      }
    }
  }

  back(): void {
    this.router.navigate(['/home']);
  }

  onRoleTypeChanged(event: any): void {
    this.searchByRoleType = event.detail.value;
    if (this.searchByRoleType.trim().toLowerCase() === 'client') {
      this.searchSpecialization = '';
    }
  }

  onIsActiveChanged(event: any): void {
    this.searchByIsActive = event.detail.value;
  }
}
