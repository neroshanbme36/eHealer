import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/core/models/appointment';
import { Payment } from 'src/app/core/models/payment';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { PaymentTransactionsService } from 'src/app/core/services/paymentTransactions.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-client-appointment-form',
  templateUrl: './client-appointment-form.component.html',
  styleUrls: ['./client-appointment-form.component.scss']
})
export class ClientAppointmentFormComponent implements OnInit {
  appointment?: Appointment;
  client?: User;
  payment?: Payment;

  constructor(
    private alertify: AlertService,
    private appointmentsSer: AppointmentsService,
    private paymentTransSer: PaymentTransactionsService,
    private usersSer: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const aptId = this.route.snapshot.params.id;
    this.bindAppoitmentDetails(aptId);
  }

  private bindAppoitmentDetails(id: number): void {
    this.appointmentsSer.getAppoitment(id)
    .subscribe((res: Appointment) => {
      if (res) {
        this.appointment = res;
      } else {
        this.router.navigate(['']);
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
      this.router.navigate(['']);
    }, () => {
      this.usersSer.getUser(this.appointment.client)
      .subscribe((res: User) => {
        if (res) {
          this.client = res;
        } else {
          this.router.navigate(['']);
        }
      }, error => {
        this.alertify.presentAlert('Error', error);
        this.router.navigate(['']);
      }, () => {
        this.paymentTransSer.getPaymentByAppointmentId(this.appointment.id)
        .subscribe((res: Payment) => {
          if (res) {
            this.payment = res;
            console.log(res);
          } else {
            this.router.navigate(['']);
          }
        }, error => {
          this.alertify.presentAlert('Error', error);
          this.router.navigate(['']);
        })
      })
    })
  }

  onAcceptBtnClicked(): void {
    this.appointment.statusType = 1; // Accept
    this.updateAppointment();
  }

  onCancelBtnClicked(): void {
    this.appointment.statusType = 3; // Cancel by therapist
    this.updateAppointment();
  }

  private updateAppointment(): void {
    this.appointmentsSer.updateAppointment(this.appointment)
    .subscribe((res: Appointment) => {
      this.appointment = res;
    }, error => {
      this.alertify.presentAlert('Error', error);
    }, () => {
      if (this.appointment.statusType === 3) {
        this.payment.transType = 1; // Refund
        this.paymentTransSer.updatePayment(this.payment)
        .subscribe((res: Payment) => {
          this.payment = res;
        }, error => {
          this.alertify.presentAlert('Error', error);
        })
      }
    })
  }
}
