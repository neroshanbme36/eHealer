import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/core/models/appointment';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Payment } from 'src/app/core/models/payment';
import { PaymentTransactionsService } from 'src/app/core/services/paymentTransactions.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss']
})
export class PaymentConfirmationComponent implements OnInit {
  appointment?: Appointment;
  therapist?: User;
  payment?: Payment;

  constructor(
    private appointmentsSer: AppointmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private alertify: AlertService,
    private usersService: UsersService,
    private paySer: PaymentTransactionsService
  ) { }

  ngOnInit() {
    const paymentId = this.route.snapshot.params.id;
    paymentId > 0 ? this.bindDetails(paymentId) : this.router.navigate(['']);
  }

  private bindDetails(paymentId: number): void {
    this.paySer.getPayment(paymentId).subscribe((res: Payment) => {
      if (res) {
        this.payment = res;
      } else {
        this.router.navigate(['']);
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
      this.router.navigate(['']);
    }, () => {
      this.appointmentsSer.getAppoitment(this.payment.appointment).subscribe((res: Appointment) => {
        if (res) {
          this.appointment = res;
        } else {
          this.router.navigate(['']);
        }
      }, error => {
        this.alertify.presentAlert('Error', error);
        this.router.navigate(['']);
      }, () => {
        this.usersService.getUser(this.payment.therapist).subscribe((res: User) => {
          if (res) {
            this.therapist = res;
          } else {
            this.router.navigate(['']);
          }
        }, error => {
          this.alertify.presentAlert('Error', error);
          this.router.navigate(['']);
        }, () => {
          console.log(this.payment);
          console.log(this.appointment);
          console.log(this.therapist);
        })
      });
    });
  }
}
