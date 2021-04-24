import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  startDateIsoStr: string;
  endDateIsoStr: string;
  filteredPayments?: Payment[];
  tot = 0;

  constructor(
    private mainRepo: RepositoryService,
    private paymentTransSer: PaymentTransactionsService,
    private alertify: AlertService,
    private router: Router,
    public datepipe: DatePipe
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.startDateIsoStr = (new Date()).toISOString();
    this.endDateIsoStr = (new Date()).toISOString();
    this.payments = [];
    this.filteredPayments = [];
    this.bindPayments();
  }

  private bindPayments(): void {
    this.paymentTransSer.getPaymentsByTherapistId(this.mainRepo.loggedInUser.id)
      .subscribe((res: Payment[]) => {
        this.payments = res;
        console.log(this.payments);
      }, error => {
        this.alertify.presentAlert('Error', error);
      }, () => {
        this.search();
      });
  }

  getFee(payment: Payment): number {
    let fee = payment.fee;
    if (payment.transType === 1 && payment.fee > 0) { // refund
      fee = fee * -1;
    }
    return fee;
  }

  search(): void {
    this.filteredPayments.length = 0;
    const sDate = this.mainRepo.getCsharpFormat(this.startDateIsoStr, 'start');
    const eDate = this.mainRepo.getCsharpFormat(this.endDateIsoStr, 'start');
    this.filteredPayments = this.payments.filter(x => (this.mainRepo.getCsharpFormat(x.createdOn.toString(), 'start') >= sDate)
      && (this.mainRepo.getCsharpFormat(x.createdOn.toString(), 'start') <= eDate));
    this.tot = 0;
    this.tot = this.getTotal();
  }

  getTotal(): number {
    let tot = 0;
    if (this.filteredPayments && this.filteredPayments.length > 0) {
      const revenue = this.filteredPayments.filter(x => x.transType === 0)
        .map(x => x.fee).reduce((a, b) => Number(a) + Number(b));
      const refund = this.filteredPayments.filter(x => x.transType === 1)
        .map(x => Number(x.fee)).reduce((a, b) => Number(a) + Number(b));
      tot = revenue - refund;
    }
    return tot;
  }

  back(): void {
    this.router.navigate(['reports/list']);
  }
}
