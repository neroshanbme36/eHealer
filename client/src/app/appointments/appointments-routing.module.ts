import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ClientAppointmentFormComponent } from './client-appoitments/client-appointment-form/client-appointment-form.component';
import { ClientAppointmentListComponent } from './client-appoitments/client-appointment-list/client-appointment-list.component';
import { MyBookingFormComponent } from './my-bookings/my-booking-form/my-booking-form.component';
import { MyBookingListComponent } from './my-bookings/my-booking-list/my-booking-list.component';

const routes: Routes = [
  {
    path: '', component: AppointmentsComponent,
    children: [
      {path: 'client_appointment_list', component: ClientAppointmentListComponent},
      {path: 'client_appointment/:id', component: ClientAppointmentFormComponent},
      {path: 'my_booking_list', component: MyBookingListComponent},
      {path: 'my_booking/:id', component: MyBookingFormComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
