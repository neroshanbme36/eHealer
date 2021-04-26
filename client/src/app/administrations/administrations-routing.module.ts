import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/administrations/users', pathMatch: 'full' },
      {path: 'users', component: UserListComponent},
      {path: 'user_edit/:id', component: UserFormComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationsRoutingModule {}
