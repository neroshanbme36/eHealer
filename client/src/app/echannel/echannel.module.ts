import { NgModule } from '@angular/core';
import { TherapistProfileComponent } from './therapist-profile/therapist-profile.component';
import { SharedModule } from '../shared/shared.module';
import { EchannelRoutingModule } from './echannel-routing.module';
import { TherapistsComponent } from './therapists/therapists.component';
import { FilterTherapistsComponent } from './therapists/filter-therapists/filter-therapists.component';
import { BookAnAppointmentComponent } from './book-an-appointment/book-an-appointment.component';

@NgModule({
  imports: [
    SharedModule,
    EchannelRoutingModule
  ],
  declarations: [
    TherapistProfileComponent,
    TherapistsComponent,
    FilterTherapistsComponent,
    BookAnAppointmentComponent
  ]
})
export class EchannelModule {}
