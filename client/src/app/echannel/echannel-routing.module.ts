import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookAnAppointmentComponent } from './book-an-appointment/book-an-appointment.component';
import { TherapistProfileComponent } from './therapist-profile/therapist-profile.component';
import { TherapistsComponent } from './therapists/therapists.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/echannel/therapists', pathMatch: 'full' },
      {path: 'therapists', component: TherapistsComponent},
      {path: 'therapist_profile/:id', component: TherapistProfileComponent},
      {path: 'book_an_appointment/:id', component: BookAnAppointmentComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EchannelRoutingModule {}
