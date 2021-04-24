import { Component, OnInit } from '@angular/core';
import { AlertService } from '../core/services/alert.service';
import { ChatFirebaseService } from '../core/services/chatFirebase.service';
import { RepositoryService } from '../core/services/repository.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    public repository: RepositoryService,
    private chatFirebaseSer: ChatFirebaseService,
    private alertify: AlertService
  ) { }

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
    this.alertify.presentAlertConfirm('Confirm', 'Are you sure to logout?', 'ok', 'cancel', () => {
      this.chatFirebaseSer.signOut()
      .then((res) => {
        localStorage.removeItem('healerToken');
        location.reload();
      }, async (err) => {
        await this.alertify.presentAlert(':(', err.message);
      });
    }, () => {});
  }
}
