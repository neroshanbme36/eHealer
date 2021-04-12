import { NgModule } from '@angular/core';
import { ConsultationFeeRoutingModule } from './consultation-fee-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ConsultationFeeComponent } from './consultation-fee/consultation-fee.component';

@NgModule({
  imports: [
    SharedModule,
    ConsultationFeeRoutingModule
  ],
  declarations: [ConsultationFeeComponent]
})
export class ConsultationFeeModule {}
