import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionReportDto } from 'src/app/core/dtos/sessionReportDto';
import { User } from 'src/app/core/models/user';
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
  distinctClient?: User[];
  searchClientName: string;

  constructor(
    private sessionSer: SessionsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sessionReports = [];
    this.distinctClient = [];
    this.searchClientName = '';
    this.bindSessionReports();
  }

  private bindSessionReports(): void {
    this.sessionSer.getReportByTherapist(this.mainRepo.loggedInUser.id).subscribe((res: SessionReportDto[]) => {
      this.sessionReports = res;
      this.getDistinctClients();
      console.log(this.sessionReports);
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  getDistinctClients(): void {
    const ls = this.sessionReports.map(x => x.client);
    const uniqueIds = [...new Set(ls.map(x => x.id))];
    uniqueIds.forEach(id => {
      const m = (ls.filter(x => x.id === id))[0];
      this.distinctClient.push(m);
    });
  }

  get filteredClients(): User[] {
    let ls = Object.assign([], this.distinctClient);
    if (this.searchClientName !== '') {
      ls = ls.filter(x => (x.client.firstName.trim().toLowerCase() + ' ' + x.client.lastName.trim().toLowerCase())
      .includes(this.searchClientName));
    }
    return ls;
  }

  back(): void {
    this.router.navigate(['reports/list']);
  }

  onViewClientSession(client: User): void {
    this.router.navigate(['reports/detailed_report', client.id]);
  }
}
