import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ClientAppointmentFormComponent } from './client-appoitments/client-appointment-form/client-appointment-form.component';
import { ClientAppointmentListComponent } from './client-appoitments/client-appointment-list/client-appointment-list.component';

const routes: Routes = [
  {
    path: '', component: AppointmentsComponent,
    children: [
      {path: 'client_appointment_list', component: ClientAppointmentListComponent},
      {path: 'client_appointment/:id', component: ClientAppointmentFormComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
