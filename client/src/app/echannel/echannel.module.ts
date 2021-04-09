import { NgModule } from '@angular/core';
import { TherapistProfileComponent } from './therapist-profile/therapist-profile.component';
import { SharedModule } from '../shared/shared.module';
import { EchannelRoutingModule } from './echannel-routing.module';
import { TherapistsComponent } from './therapists/therapists.component';
import { FilterTherapistsComponent } from './therapists/filter-therapists/filter-therapists.component';
import { BookAnAppointmentComponent } from './book-an-appointment/book-an-appointment.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { StripeElementsComponent } from './checkout/stripe-elements/stripe-elements.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

@NgModule({
  imports: [
    SharedModule,
    EchannelRoutingModule
  ],
  declarations: [
    TherapistProfileComponent,
    TherapistsComponent,
    FilterTherapistsComponent,
    BookAnAppointmentComponent,
    CheckoutComponent,
    StripeElementsComponent,
    PaymentConfirmationComponent
  ]
})
export class EchannelModule {}
