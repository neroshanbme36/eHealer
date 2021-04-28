import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReportAdminSessionClientComponent } from './report-admin-session-client/report-admin-session-client.component';
import { ReportAdminSessionTherapistComponent } from './report-admin-session-therapist/report-admin-session-therapist.component';
import { ReportDetailedSessionComponent } from './report-detailed-session/report-detailed-session.component';
import { ReportSessionClientComponent } from './report-session-client/report-session-client.component';
import { ReportSessionTherapistComponent } from './report-session-therapist/report-session-therapist.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { RevenueReportComponent } from './revenue-report/revenue-report.component';

@NgModule({
  imports: [
    SharedModule,
    ReportsRoutingModule
  ],
  declarations: [
    ReportsComponent,
    ReportSessionTherapistComponent,
    ReportSessionClientComponent,
    ReportDetailedSessionComponent,
    RevenueReportComponent,
    ReportAdminSessionClientComponent,
    ReportAdminSessionTherapistComponent
  ]
})
export class ReportsModule {}
