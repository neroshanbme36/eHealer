import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/chats/chat_list', pathMatch: 'full' },
      {path: 'chat_list', component: ChatListComponent},
      {path: 'chat_page/:id', component: ChatPageComponent},
      {path: 'video_call/:id', component: VideoCallComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
