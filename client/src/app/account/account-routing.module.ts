import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPage } from './account.page';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: AccountPage},
      { path: 'my-profile', component: ProfileComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
