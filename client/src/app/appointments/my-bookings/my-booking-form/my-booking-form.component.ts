import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/core/models/appointment';
import { Payment } from 'src/app/core/models/payment';
import { Session } from 'src/app/core/models/session';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { PaymentTransactionsService } from 'src/app/core/services/paymentTransactions.service';
import { SessionsService } from 'src/app/core/services/sessions.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-my-booking-form',
  templateUrl: './my-booking-form.component.html',
  styleUrls: ['./my-booking-form.component.scss']
})
export class MyBookingFormComponent implements OnInit {
  appointment?: Appointment;
  therapist?: User;
  payment?: Payment;
  isSessionCompleted: boolean;

  constructor(
    private alertify: AlertService,
    private appointmentsSer: AppointmentsService,
    private paymentTransSer: PaymentTransactionsService,
    private usersSer: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionSer: SessionsService
  ) { }

  ngOnInit() {
    this.appointment = new Appointment();
  }

  ionViewWillEnter() {
    const aptId = this.route.snapshot.params.id;
    this.isSessionCompleted = false;
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
        this.usersSer.getUser(this.appointment.therapist)
          .subscribe((res: User) => {
            if (res) {
              this.therapist = res;
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
                } else {
                  this.router.navigate(['']);
                }
              }, error => {
                this.alertify.presentAlert('Error', error);
                this.router.navigate(['']);
              }, () => {
                this.sessionSer.getSessionByAppointmentId(this.appointment.id)
                .subscribe((res: Session) => {
                  this.isSessionCompleted = true;
                });
              });
          });
      });
  }

  onCancelBtnClicked(): void {
    let isApprovedByTherapist = false;
    let cancelConfirmMsg = 'Are you sure to cancel this appointment.';
    if (this.appointment.statusType === 1) {
      cancelConfirmMsg += 'Please note the appointment is already approved by therapist and sorry the payment will not be refunded';
      isApprovedByTherapist = true;
    }
    this.alertify.presentAlertConfirm('Confirm', cancelConfirmMsg + '?', 'Ok', 'Cancel', () => {
      this.appointment.statusType = 4; // Cancel by client
      this.appointmentsSer.updateAppointment(this.appointment)
        .subscribe((res: Appointment) => {
          this.appointment = res;
        }, error => {
          this.alertify.presentAlert('Error', error);
        }, () => {
          if (!isApprovedByTherapist) {
            this.payment.transType = 1; // Refund
            this.paymentTransSer.updatePayment(this.payment)
              .subscribe((res: Payment) => {
                this.payment = res;
              }, error => {
                this.alertify.presentAlert('Error', error);
              });
          }
          this.appointmentsSer.sendEmailByStatus(this.appointment.id).subscribe((res: void) => {},
          error => {this.alertify.presentAlert('Error', error)});
        });
    }, () => { });
  }

  back(): void {
    this.router.navigate(['appointments/my_booking_list']);
  }

  onChatWithTherapistBtnClicked(): void {
    this.router.navigate(['/chats/chat_page', this.therapist.username]);
  }

  onStartSessionBtnClicked(): void {
    this.router.navigate(['chats/video_call/', this.appointment.therapist], {queryParams: {appointmentId: this.appointment.id}});
  }
}
