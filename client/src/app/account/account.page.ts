import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/services/repository.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(public repository: RepositoryService) { }

  ngOnInit() {
    console.log(this.repository.loggedInUser);
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
    // if (this.repository.loggedInCustomer) {
    //   if (this.repository.loggedInCustomer.lastName) {
    //       return this.repository.loggedInCustomer.firstName + ' ' + this.repository.loggedInCustomer.lastName;
    //   } else {
    //     return this.repository.loggedInCustomer.firstName;
    //   }
    // }
    return 'TEST';
  }

  goPage(url: string): void {
    this.repository.navigate(url);
  }

  logout() {
    // this.authService.logout();
  }
}
