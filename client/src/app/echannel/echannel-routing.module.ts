import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookAnAppointmentComponent } from './book-an-appointment/book-an-appointment.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { TherapistProfileComponent } from './therapist-profile/therapist-profile.component';
import { TherapistsComponent } from './therapists/therapists.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/echannel/therapists', pathMatch: 'full' },
      {path: 'therapists', component: TherapistsComponent},
      {path: 'therapist_profile/:id', component: TherapistProfileComponent},
      {path: 'book_an_appointment/:id', component: BookAnAppointmentComponent},
      {path: 'checkout', component: CheckoutComponent},
      {path: 'payment_confirmation/:id', component: PaymentConfirmationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EchannelRoutingModule {}
