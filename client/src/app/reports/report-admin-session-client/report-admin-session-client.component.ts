import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionReportDto } from 'src/app/core/dtos/sessionReportDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SessionsService } from 'src/app/core/services/sessions.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-report-admin-session-client',
  templateUrl: './report-admin-session-client.component.html',
  styleUrls: ['./report-admin-session-client.component.scss']
})
export class ReportAdminSessionClientComponent implements OnInit {
  // viewed by therapist
  sessionReports?: SessionReportDto[];
  distinctClient?: User[];
  searchClientName: string;
  imgUrl = '';
  clientId: number;
  therapistId: number;

  constructor(
    private sessionSer: SessionsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private usersSer: UsersService
  ) { }

  ngOnInit() {
    this.searchClientName = '';
    this.imgUrl = '../../../assets/images/';
  }

  ionViewWillEnter() {
    this.clientId = this.route.snapshot.queryParams.clientId ? Number(this.route.snapshot.queryParams.clientId) : 0;
    this.therapistId = this.route.snapshot.queryParams.therapistId ? Number(this.route.snapshot.queryParams.therapistId) : 0;
    this.sessionReports = [];
    this.distinctClient = [];
    this.bindSessionReports();
  }

  private bindSessionReports(): void {
    if (this.therapistId > 0) {
      this.sessionSer.getReportByTherapist(this.therapistId).subscribe((res: SessionReportDto[]) => {
        this.sessionReports = res;
        this.getDistinctClients();
        console.log(this.sessionReports);
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    } else {
      this.usersSer.getUsers().subscribe((res: User[]) => {
        this.distinctClient = res.filter(x => x.roleType.trim().toLowerCase() === 'client');
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    }
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
      ls = ls.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
        .includes(this.searchClientName));
    }
    return ls;
  }

  getImg(gender: string): string {
    if (gender === 'male') {
      return 'client-male.png';
    } else if (gender === 'female') {
      return 'client-female.png';
    } else {
      return 'client-other.png';
    }
  }

  back(): void {
    if (this.therapistId > 0) {
      this.router.navigate(['/reports/admin_session_therapist']);
    } else {
      this.router.navigate(['reports/list']);
    }
  }

  onViewClientSession(client: User): void {
    if (this.therapistId > 0) {
      this.router.navigate(['reports/detailed_report', client.id], {queryParams: {therapistId: this.therapistId}});
    } else {
      this.router.navigate(['/reports/admin_session_therapist'], {queryParams: { therapistId: this.therapistId,  clientId: client.id}});
    }
  }
}
