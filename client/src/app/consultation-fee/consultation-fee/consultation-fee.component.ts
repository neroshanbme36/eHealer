import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TherapistFee } from 'src/app/core/models/therapistFee';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { TherapistfeesService } from 'src/app/core/services/therapistfees.service';

@Component({
  selector: 'app-consultation-fee',
  templateUrl: './consultation-fee.component.html',
  styleUrls: ['./consultation-fee.component.scss']
})
export class ConsultationFeeComponent implements OnInit {
  therapistFee: TherapistFee;

  constructor(
    private mainRepo: RepositoryService,
    private therapistFeeSer: TherapistfeesService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.therapistFee = new TherapistFee();
    this.therapistFee.user = this.mainRepo.loggedInUser.id;
    this.bindTherapistFeeDetails();
  }

  private bindTherapistFeeDetails(): void {
    this.therapistFeeSer.getTherapistFeeUserId(this.mainRepo.loggedInUser.id)
    .subscribe((res: TherapistFee) => {
      if (res) {
        this.therapistFee = res;
        console.log(this.therapistFee);
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  onSaveBtnClicked(): void {
    if (this.therapistFee.id > 0) {
      this.therapistFeeSer.updateTherapistFee(this.therapistFee)
      .subscribe((res: TherapistFee) => {
        this.therapistFee = res;
        this.alertify.presentAlert('Message', 'Consulation fee updated successfully');
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    } else {
      this.therapistFeeSer.createTherapistFee(this.therapistFee)
      .subscribe((res: TherapistFee) => {
        this.therapistFee = res;
        this.alertify.presentAlert('Message', 'Consulation fee saved successfully.');
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    }
  }

  back(): void {
    this.router.navigate(['home']);
  }
}
