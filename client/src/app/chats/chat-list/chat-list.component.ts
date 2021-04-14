import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatListDto } from 'src/app/core/dtos/chatListDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ChatFirebaseService } from 'src/app/core/services/chatFirebase.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  imgUrl: string;
  users: User[];
  chatList: Observable<ChatListDto[]>;

  constructor(
    private chatFirebaseSer: ChatFirebaseService,
    private usersSer: UsersService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.imgUrl = '../../../assets/therapists/';
    this.bindUserDetails();
  }

  private bindUserDetails(): void {
    this.usersSer.getUsers().subscribe((res: User[]) => {
      this.users = res;
    }, error => {
      this.alertify.presentAlert('Error', error);
    }, () => {
      this.chatList = this.chatFirebaseSer.getChatListMessages(this.users);
    });
  }

  onChatMsgBtnClicked(senderEmail: string): void {
    this.router.navigate(['/chats/chat_page', senderEmail]);
  }
}
