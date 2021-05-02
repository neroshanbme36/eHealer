import { NgModule } from '@angular/core';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { AboutUsComponent } from './about-us/about-us.component';

@NgModule({
  imports: [
    AccountPageRoutingModule,
    SharedModule
  ],
  declarations: [
    AccountPage,
    ProfileComponent,
    AboutUsComponent
  ]
})
export class AccountPageModule {}
