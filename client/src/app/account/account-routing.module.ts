import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicyComponent } from '../shared/components/policy/policy.component';
import { AboutUsComponent } from './about-us/about-us.component';

import { AccountPage } from './account.page';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: AccountPage},
      { path: 'my-profile', component: ProfileComponent},
      { path: 'policy', component: PolicyComponent},
      { path: 'about-us', component: AboutUsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
