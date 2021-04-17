import { NgModule } from '@angular/core';
import { ChatsRoutingModule } from './chats-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { VideoCallComponent } from './video-call/video-call.component';

@NgModule({
  imports: [
    SharedModule,
    ChatsRoutingModule
  ],
  declarations: [
    ChatListComponent,
    ChatPageComponent,
    VideoCallComponent
  ]
})
export class ChatsModule {}
