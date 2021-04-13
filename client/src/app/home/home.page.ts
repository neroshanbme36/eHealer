import { Component } from '@angular/core';
import { ChatFirebaseService } from '../core/services/chatFirebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private chatFirebaseSer: ChatFirebaseService) {}

  onCheckUserBtnClicked() {
    console.log(this.chatFirebaseSer.currentUser);
  }
}
