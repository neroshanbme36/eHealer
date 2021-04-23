import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/core/models/payment';
import { AlertService } from 'src/app/core/services/alert.service';
import { PaymentTransactionsService } from 'src/app/core/services/paymentTransactions.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.scss']
})
export class RevenueReportComponent implements OnInit {
  payments?: Payment[];

  constructor(
    private mainRepo: RepositoryService,
    private paymentTransSer: PaymentTransactionsService,
    private alertify: AlertService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.payments = [];
    this.bindPayments();
  }

  private bindPayments(): void {
    this.paymentTransSer.getPaymentsByTherapistId(this.mainRepo.loggedInUser.id)
      .subscribe((res: Payment[]) => {
        this.payments = res;
        console.log(this.payments);
      }, error => {
        this.alertify.presentAlert('Error', error);
      })
  }
}
