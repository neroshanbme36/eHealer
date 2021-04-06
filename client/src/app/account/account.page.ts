import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/services/repository.service';
import { UsersService } from '../core/services/users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(public repository: RepositoryService, private usersService: UsersService) { }

  ngOnInit() {
  }

  get greeting(): string {
    const today = new Date();
    const curHr = today.getHours();

    if (curHr < 12) {
      return 'Good morning';
    } else if (curHr < 16) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  get name(): string {
    if (this.repository.loggedInUser) {
      if (this.repository.loggedInUser.lastName) {
          return this.repository.loggedInUser.firstName + ' ' + this.repository.loggedInUser.lastName;
      } else {
        return this.repository.loggedInUser.firstName;
      }
    }
  }

  goPage(url: string): void {
    this.repository.navigate(url);
  }

  logout() {
    localStorage.removeItem('healerToken');
    location.reload();
  }
}
