import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionReportDto } from 'src/app/core/dtos/sessionReportDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SessionsService } from 'src/app/core/services/sessions.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-report-admin-session-therapist',
  templateUrl: './report-admin-session-therapist.component.html',
  styleUrls: ['./report-admin-session-therapist.component.scss']
})
export class ReportAdminSessionTherapistComponent implements OnInit {
  // viewed by client
  sessionReports?: SessionReportDto[];
  distinctTherapist?: User[];
  searchTherapistName: string;
  searchSpecialization: string;
  imgUrl: string;
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
    this.searchTherapistName = '';
    this.searchSpecialization = '';
    this.imgUrl = '../../../assets/therapists/';
  }

  ionViewWillEnter() {
    this.clientId = this.route.snapshot.queryParams.clientId ? Number(this.route.snapshot.queryParams.clientId) : 0;
    this.therapistId = this.route.snapshot.queryParams.therapistId ? Number(this.route.snapshot.queryParams.therapistId) : 0;
    this.sessionReports = [];
    this.distinctTherapist = [];
    this.bindSessionReports();
  }

  private bindSessionReports(): void {
    if (this.clientId > 0) {
      this.sessionSer.getReportByClient(this.clientId).subscribe((res: SessionReportDto[]) => {
        this.sessionReports = res;
        this.getDistinctTherapist();
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    } else {
      this.usersSer.getUsers().subscribe((res: User[]) => {
        this.distinctTherapist = res.filter(x => x.roleType.trim().toLowerCase() === 'therapist');
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    }
  }

  getDistinctTherapist(): void {
    const ls = this.sessionReports.map(x => x.therapist);
    const uniqueIds = [...new Set(ls.map(x => x.id))];
    uniqueIds.forEach(id => {
      const m = (ls.filter(x => x.id === id))[0];
      this.distinctTherapist.push(m);
    });
  }

  get filteredTherapists(): User[] {
    if (this.searchTherapistName === '' && this.searchSpecialization === '') {
      return this.distinctTherapist;
    } else if (this.searchTherapistName !== '' && this.searchSpecialization === '') {
      return this.distinctTherapist.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
        .includes(this.searchTherapistName));
    } else if (this.searchTherapistName === '' && this.searchSpecialization !== '') {
      return this.distinctTherapist.filter(x => x.specialization.trim().toLowerCase()
        .includes(this.searchSpecialization.trim().toLowerCase()));
    } else {
      return this.distinctTherapist.filter(x => (x.firstName.trim().toLowerCase() + ' ' + x.lastName.trim().toLowerCase())
        .includes(this.searchTherapistName) && x.specialization.trim().toLowerCase()
          .includes(this.searchSpecialization.trim().toLowerCase()));
    }
  }

  onViewTherapistSession(therapist: User): void {
    if (this.clientId > 0) {
      this.router.navigate(['reports/detailed_report', therapist.id], {queryParams: {clientId: this.clientId}});
    } else {
      this.router.navigate(['/reports/admin_session_client'], {queryParams: { therapistId: therapist.id,  clientId: this.clientId}});
    }
  }

  getImg(gender: string): string {
    if (gender === 'male') {
      return 'male.png';
    } else if (gender === 'female') {
      return 'female.png';
    } else {
      return 'other.png';
    }
  }

  back(): void {
    if (this.clientId > 0) {
      this.router.navigate(['/reports/admin_session_client']);
    } else {
      this.router.navigate(['reports/list']);
    }
  }
}
