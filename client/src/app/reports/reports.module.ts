import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReportDetailedSessionComponent } from './report-detailed-session/report-detailed-session.component';
import { ReportSessionClientComponent } from './report-session-client/report-session-client.component';
import { ReportSessionTherapistComponent } from './report-session-therapist/report-session-therapist.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  imports: [
    SharedModule,
    ReportsRoutingModule
  ],
  declarations: [
    ReportsComponent,
    ReportSessionTherapistComponent,
    ReportSessionClientComponent,
    ReportDetailedSessionComponent
  ]
})
export class ReportsModule {}
