import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { error } from 'selenium-webdriver';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('editUserForm', {static: false}) editForm: NgForm;
  editUser: User = null;
  constructor(
    private repository: RepositoryService,
    private alertify: AlertService,
    private usersService: UsersService
    ) { }

  ngOnInit() {
  }

  get name(): string {
    if (this.repository.loggedInUser) {
        return this.repository.loggedInUser.firstName + ' ' + this.repository.loggedInUser.lastName;
    }
  }

  get user(): User {
    return this.repository.loggedInUser;
  }

  setUser(u: User): void {
    this.editUser = Object.assign({}, u);
  }

  genderChange(event): void {
    this.editUser.gender = event.detail.value;
  }

  mariralChange(event): void {
    this.editUser.martialStatus = event.detail.value;
  }

  saveUser() {
    if (!this.editForm.dirty) {
      this.alertify.presentAlert('Message', 'Nothing to change');
    } else {
      if (!this.editForm.valid) {
        this.alertify.presentAlert('Warning', 'Please provide valid information');
      } else {
        this.save();
      }
    }
  }

  save() {
    this.editUser.birthDate = this.repository.getCsharpFormat(this.editUser.birthDate, 'start');
    this.usersService.updateUser(this.editUser).subscribe((res: User) => {
      this.alertify.presentAlert('Success', 'User updated successfully');
    }, e => {
      this.alertify.presentAlert('Error', e);
    }, () => {
      this.usersService.getUser(this.repository.loggedInUser.id).subscribe((res) => {
        this.repository.loggedInUser = res;
      }, err => {
        this.alertify.presentAlert('Error', err);
      }, () => {
        this.editUser = null;
      });
    });
  }
}
