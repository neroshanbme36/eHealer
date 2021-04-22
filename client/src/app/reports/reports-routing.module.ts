import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportDetailedSessionComponent } from './report-detailed-session/report-detailed-session.component';
import { ReportSessionClientComponent } from './report-session-client/report-session-client.component';
import { ReportSessionTherapistComponent } from './report-session-therapist/report-session-therapist.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/list', pathMatch: 'full' },
      { path: 'list', component: ReportsComponent },
      { path: 'session_client', component: ReportSessionClientComponent },
      { path: 'session_therapist', component: ReportSessionTherapistComponent },
      { path: 'detailed_report/:id', component: ReportDetailedSessionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
