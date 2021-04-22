import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionReportDto } from 'src/app/core/dtos/sessionReportDto';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SessionsService } from 'src/app/core/services/sessions.service';

@Component({
  selector: 'app-report-detailed-session',
  templateUrl: './report-detailed-session.component.html',
  styleUrls: ['./report-detailed-session.component.scss']
})
export class ReportDetailedSessionComponent implements OnInit {
  filterUserId: number;
  sessionReports?: SessionReportDto[];

  constructor(
    private sessionSer: SessionsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sessionReports = [];
    this.filterUserId = this.route.snapshot.params.id; // if client then filter therapist
    this.bindSessionReports();
  }

  private bindSessionReports(): void {
    if (this.mainRepo.loggedInUser.roleType.trim().toLowerCase() === 'client') {
      this.sessionSer.getReportByClient(this.mainRepo.loggedInUser.id).subscribe((res: SessionReportDto[]) => {
        this.sessionReports = res;
        console.log(this.sessionReports);
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    } else {
      this.sessionSer.getReportByTherapist(this.mainRepo.loggedInUser.id).subscribe((res: SessionReportDto[]) => {
        this.sessionReports = res;
        console.log(this.sessionReports);
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    }
  }
}
