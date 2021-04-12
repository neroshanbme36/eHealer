import { NgModule } from '@angular/core';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ClientAppointmentListComponent } from './client-appoitments/client-appointment-list/client-appointment-list.component';
import { SharedModule } from '../shared/shared.module';
import { ClientAppointmentFormComponent } from './client-appoitments/client-appointment-form/client-appointment-form.component';
import { MyBookingFormComponent } from './my-bookings/my-booking-form/my-booking-form.component';
import { MyBookingListComponent } from './my-bookings/my-booking-list/my-booking-list.component';

@NgModule({
  imports: [
    SharedModule,
    AppointmentsRoutingModule
  ],
  declarations: [
    AppointmentsComponent,
    ClientAppointmentListComponent,
    ClientAppointmentFormComponent,
    MyBookingListComponent,
    MyBookingFormComponent
  ]
})
export class AppointmentsModule {}
