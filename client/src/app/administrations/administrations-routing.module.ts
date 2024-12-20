import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactUsFormComponent } from '../shared/components/contact-us-form/contact-us-form.component';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/administrations/users', pathMatch: 'full' },
      {path: 'users', component: UserListComponent},
      {path: 'user_edit/:id', component: UserFormComponent},
      {path: 'enquiries', component: EnquiryListComponent},
      {path: 'contact_us_edit/:id', component: ContactUsFormComponent},
      {path: 'contact_us_new', component: ContactUsFormComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationsRoutingModule {}
