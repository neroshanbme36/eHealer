import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionReportDto } from 'src/app/core/dtos/sessionReportDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SessionsService } from 'src/app/core/services/sessions.service';

@Component({
  selector: 'app-report-session-therapist',
  templateUrl: './report-session-therapist.component.html',
  styleUrls: ['./report-session-therapist.component.scss']
})
export class ReportSessionTherapistComponent implements OnInit {
  // viewed by client
  sessionReports?: SessionReportDto[];
  distinctTherapist?: User[];
  searchTherapistName: string;
  searchSpecialization: string;
  imgUrl: string;

  constructor(
    private sessionSer: SessionsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.searchTherapistName = '';
    this.searchSpecialization = '';
    this.sessionReports = [];
    this.distinctTherapist = [];
    this.bindSessionReports();
    this.imgUrl = '../../../assets/therapists/';
  }

  private bindSessionReports(): void {
    this.sessionSer.getReportByClient(this.mainRepo.loggedInUser.id).subscribe((res: SessionReportDto[]) => {
      this.sessionReports = res;
      this.getDistinctTherapist();
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
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
    this.router.navigate(['reports/detailed_report', therapist.id]);
  }

  getImg(gender: string): string {
    if (gender === 'male') {
      return 'male.png';
    } else if (gender === 'female'){
      return 'female.png';
    } else {
      return 'other.png';
    }
  }

  back(): void {
    this.router.navigate(['reports/list']);
  }
}
