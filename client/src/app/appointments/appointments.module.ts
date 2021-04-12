import { NgModule } from '@angular/core';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ClientAppointmentListComponent } from './client-appoitments/client-appointment-list/client-appointment-list.component';
import { SharedModule } from '../shared/shared.module';
import { ClientAppointmentFormComponent } from './client-appoitments/client-appointment-form/client-appointment-form.component';

@NgModule({
  imports: [
    SharedModule,
    AppointmentsRoutingModule
  ],
  declarations: [
    AppointmentsComponent,
    ClientAppointmentListComponent,
    ClientAppointmentFormComponent
  ]
})
export class AppointmentsModule {}
