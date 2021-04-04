import { Component } from '@angular/core';
import { User } from '../core/models/user';
import { AlertService } from '../core/services/alert.service';
import { UsersService } from '../core/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  check: User;

  constructor(private usersService: UsersService, private alertify: AlertService) {
    this.usersService.getUsers()
    .subscribe((res: User[]) => {
      this.check = res[0];
    }, error => {
      this.alertify.presentAlert('Error', error);
    }, () => {
      this.check.username = 'angular';
      this.check.password = 'hi';
      this.usersService.createUser(this.check)
      .subscribe((res: User) => {
      }, error => {
        this.alertify.presentAlert('Error', error);
      })
    })
  }
}
