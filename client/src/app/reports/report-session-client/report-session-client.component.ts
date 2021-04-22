import { Component, OnInit } from '@angular/core';
import { SessionReportDto } from 'src/app/core/dtos/sessionReportDto';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SessionsService } from 'src/app/core/services/sessions.service';

@Component({
  selector: 'app-report-session-client',
  templateUrl: './report-session-client.component.html',
  styleUrls: ['./report-session-client.component.scss']
})
export class ReportSessionClientComponent implements OnInit {
  // viewed by therapist
  sessionReports?: SessionReportDto[];

  constructor(
    private sessionSer: SessionsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService
  ) { }

  ngOnInit() {
    this.sessionReports = [];
    this.bindSessionReports();
  }

  private bindSessionReports(): void {
    this.sessionSer.getReportByTherapist(this.mainRepo.loggedInUser.id).subscribe((res: SessionReportDto[]) => {
      this.sessionReports = res;
      console.log(this.sessionReports);
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }
}
