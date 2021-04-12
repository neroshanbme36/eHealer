import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationFeeComponent } from './consultation-fee/consultation-fee.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationFeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationFeeRoutingModule {}
