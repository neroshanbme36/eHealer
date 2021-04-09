import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeElementDto } from 'src/app/core/dtos/stripeElementDto';
import { Appointment } from 'src/app/core/models/appointment';
import { Payment } from 'src/app/core/models/payment';
import { Schedule } from 'src/app/core/models/schedule';
import { TherapistFee } from 'src/app/core/models/therapistFee';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { PaymentTransactionsService } from 'src/app/core/services/paymentTransactions.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SchedulesService } from 'src/app/core/services/schedules.service';
import { TherapistfeesService } from 'src/app/core/services/therapistfees.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  therapist?: User;
  schedule?: Schedule;
  therpaistFee?: TherapistFee;
  requestedDate?: string;
  stripeElementDto: StripeElementDto;
  appointment?: Appointment;
  imgUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersSer: UsersService,
    private schedulesSer: SchedulesService,
    private alertify: AlertService,
    private therapistFeeSer: TherapistfeesService,
    private appointmentSer: AppointmentsService,
    private mainRepo: RepositoryService,
    private paymentsSer: PaymentTransactionsService
  ) { }

  ngOnInit() {
    const therapistId = this.route.snapshot.queryParams.therapist_id;
    this.requestedDate = this.route.snapshot.queryParams.requested_date;
    const scheduleId = this.route.snapshot.queryParams.schedule_id;
    this.stripeElementDto = new StripeElementDto();
    if (therapistId && this.requestedDate && scheduleId) {
      this.bindRequiredDetails(therapistId, scheduleId);
    } else {
      this.router.navigate(['']);
    }
    this.imgUrl = '../../../assets/therapists/';
  }

  bindRequiredDetails(therapistId: number, scheduleId: number): void {
    this.usersSer.getUser(therapistId).subscribe((res: User) => {
      if (res) {
        this.therapist = res;
      } else {
        this.router.navigate(['']);
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
      this.router.navigate(['']);
    }, () => {
      if (this.therapist.isActive) {
        this.therapistFeeSer.getTherapistUserId(this.therapist.id)
          .subscribe((res: TherapistFee) => {
            if (res) {
              this.therpaistFee = res;
            } else {
              this.router.navigate(['']);
            }
          }, error => {
            this.alertify.presentAlert('Error', error);
            this.router.navigate(['']);
          }, () => {
            this.schedulesSer.getSchedule(scheduleId).subscribe((res: Schedule) => {
              if (res) {
                this.schedule = res;
              } else {
                this.router.navigate(['']);
              }
            }, error => {
              this.alertify.presentAlert('Error', error);
              this.router.navigate(['']);
            }, () => {
              this.appointment = new Appointment();
              this.appointment.slotDate = new Date(this.requestedDate + 'T00:00:00');
              this.appointment.slotStartTime = new Date(this.requestedDate + 'T' + this.schedule.openingTime);
              this.appointment.slotEndTime = new Date(this.requestedDate + 'T' + this.schedule.closingTime);
              this.appointment.slotDurationInMins = this.therpaistFee.slotDurationInMins;
              this.appointment.fee = this.therpaistFee.fee;
              this.appointment.statusType = 0;
              this.appointment.client = this.mainRepo.loggedInUser.id;
              this.appointment.therapist = this.therapist.id;
            });
          });
      } else {
        this.router.navigate(['']);
      }
    });
  }

  onEventEmittedFromStripeEleComp(strEle: StripeElementDto): void {
    this.stripeElementDto = strEle;
  }

  get isEnableConfirmPaymentBtn(): boolean {
    let res = true;
    if (!this.stripeElementDto.nameOnCard) {
      res = false;
    }
    if (!this.stripeElementDto.isCardNumberValid) {
      res = false;
    }
    if (!this.stripeElementDto.isCardExpiryValid) {
      res = false;
    }
    if (!this.stripeElementDto.isCardCvcValid) {
      res = false;
    }
    return res;
  }

  onPayBtnClicked(): void {
    let isAppoitmentExists = true;
    this.appointmentSer.isAppointmentExist(this.requestedDate, this.schedule.id)
    .subscribe((res: any) => {
      if (res) {
        isAppoitmentExists = res.result;
      }
    }, error => {
      this.alertify.presentAlert('Error', error);
    }, () => {
      if (!isAppoitmentExists) {
        this.appointmentSer.createAppoitment(this.appointment).subscribe((res: Appointment) => {
          this.appointment = res;
        }, error => {
          this.alertify.presentAlert('Error', error);
        }, () => {
          if (this.appointment) {
            let payt = new Payment();
            payt.transType = 0;
            payt.fee = this.therpaistFee.fee;
            payt.appointment = this.appointment.id;
            payt.client = this.mainRepo.loggedInUser.id;
            payt.therapist = this.therapist.id;

            this.paymentsSer.createPayment(payt).subscribe((res: Payment) => {
              payt = res;
            }, error => {
              this.alertify.presentAlert('Error', error);
            }, () => {
              this.router.navigate(['echannel/payment_confirmation', payt.id]);
            });
          } else {
            this.alertify.presentAlert('Error', 'This schedule is already booked please select another schedule')
            .then(() => {
              this.router.navigate(['echannel/book_an_appointment', this.therapist.id]);
            });
          }
        });
      }
    });
  }

  back(): void {
    const therapistId = this.route.snapshot.queryParams.therapist_id;
    this.router.navigate(['echannel/book_an_appointment', therapistId]);
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
}
