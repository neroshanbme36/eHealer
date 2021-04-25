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
  totalRevenue: number;
  totalRefund: number;

  constructor(
    private mainRepo: RepositoryService,
    private paymentTransSer: PaymentTransactionsService,
    private alertify: AlertService,
    private router: Router,
    public datepipe: DatePipe
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const today = new Date();
    this.startDateIsoStr = this.datepipe.transform(today, 'yyyy-MM-dd') + 'T00:00:00';
    this.endDateIsoStr = this.datepipe.transform(today, 'yyyy-MM-dd') + 'T23:59:59';
    console.log(this.startDateIsoStr);
    console.log(this.endDateIsoStr);
    this.payments = [];
    this.filteredPayments = [];
    this.totalRevenue = 0;
    this.totalRefund = 0;
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
    const sDate = this.mainRepo.getCsharpFormat(this.startDateIsoStr, 'start') + 'T00:00:00';
    const eDate = this.mainRepo.getCsharpFormat(this.endDateIsoStr, 'end') + 'T23:59:59';
    this.filteredPayments = this.payments.filter(x => (x.createdOn.toString() >= sDate)
      && (x.createdOn.toString() <= eDate));
    this.totalRevenue = 0;
    this.totalRefund = 0
    this.getTotal();
  }

  getTotal(): void {
    if (this.filteredPayments && this.filteredPayments.length > 0) {
      this.totalRevenue = this.filteredPayments.filter(x => x.transType === 0)
        .map(x => x.fee).reduce((a, b) => Number(a) + Number(b));
      this.totalRefund = this.filteredPayments.filter(x => x.transType === 1)
        .map(x => Number(x.fee)).reduce((a, b) => Number(a) + Number(b));
    }
  }

  back(): void {
    this.router.navigate(['reports/list']);
  }
}
