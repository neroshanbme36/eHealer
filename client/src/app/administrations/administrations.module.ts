import { NgModule } from '@angular/core';
import { AdministrationsRoutingModule } from './administrations-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';


@NgModule({
  imports: [
    SharedModule,
    AdministrationsRoutingModule
  ],
  declarations: [
    UserListComponent,
    UserFormComponent
  ]
})
export class AdministrationsModule {}
