import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MessageFirebaseDto } from 'src/app/core/dtos/messageFirebaseDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ChatFirebaseService } from 'src/app/core/services/chatFirebase.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  sender: User;
  recEmail: string;
  messages: Observable<MessageFirebaseDto[]>;
  newMsg: string;

  constructor(
    private chatFirebaseSer: ChatFirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private mainRepo: RepositoryService,
    private usersSer: UsersService,
    private alertify: AlertService
  ) { }

  ngOnInit() {
    this.sender = new User();
  }

  ionViewWillEnter() {
    this.recEmail = this.route.snapshot.params.id;
    this.newMsg = '';
    this.sender = new User();
    if (this.recEmail.trim().toLowerCase() !== this.mainRepo.loggedInUser.email.trim().toLowerCase()) {
      this.bindSender();
      this.messages = this.chatFirebaseSer.getChatMessageBtwUsers(this.recEmail);
    } else {
      this.router.navigate(['']);
    }
    if (this.mainRepo.previousUrl === '') {
      this.mainRepo.previousUrl = 'chats/chat_list';
    }
  }

  sendMessage(): void {
    this.chatFirebaseSer.addChatMessage(this.newMsg, this.recEmail).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  private bindSender(): void {
    this.usersSer.getUserByUsername(this.recEmail)
    .subscribe((res: User) => {
      if (res) {
        this.sender = res;
      } else {
        this.router.navigate(['']);
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
      this.router.navigate(['']);
    });
  }

  back(): void {
    this.router.navigate([this.mainRepo.previousUrl]);
  }

  // videoCall(callTo: number): void {
  //   this.router.navigate(['/chats/video_call', callTo]);
  // }
}
