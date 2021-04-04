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

  constructor(private usersService: UsersService, private alertify: AlertService) {
    this.usersService.getUsers()
    .subscribe((res: User[]) => {
      console.log(res);
    }, error => {
      // console.log(error);
      // this.alertify.presentAlert('Error', error);
    })
  }
}
