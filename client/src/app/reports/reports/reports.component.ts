import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(
    public mainRepo: RepositoryService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  back(): void {
    this.router.navigate(['home']);
  }

  onAdminReportClientSessionClicked() {
    this.router.navigate(['/reports/admin_session_client']);
  }

  onAdminReportTherapistSessionClicked() {
    this.router.navigate(['/reports/admin_session_therapist']);
  }
}
