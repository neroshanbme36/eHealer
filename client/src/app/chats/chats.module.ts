import { NgModule } from '@angular/core';
import { ChatsRoutingModule } from './chats-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatPageComponent } from './chat-page/chat-page.component';

@NgModule({
  imports: [
    SharedModule,
    ChatsRoutingModule
  ],
  declarations: [
    ChatListComponent,
    ChatPageComponent
  ]
})
export class ChatsModule {}
