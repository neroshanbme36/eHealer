import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule } from 'src/app/core/models/schedule';
import { AlertService } from 'src/app/core/services/alert.service';
import { SchedulesService } from 'src/app/core/services/schedules.service';

@Component({
  selector: 'app-book-an-appointment',
  templateUrl: './book-an-appointment.component.html',
  styleUrls: ['./book-an-appointment.component.scss']
})
export class BookAnAppointmentComponent implements OnInit {
  therapistId: number;
  schedules?: Schedule[];
  unbookedSlots?: Schedule[];
  selectedDate: string;
  maxAppointmentYear: number;
  selectedSchedule?: Schedule;
  strToday: string;

  constructor(
    private schedulesSer: SchedulesService,
    private route: ActivatedRoute,
    private alertify: AlertService,
    public datepipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit() {
    this.unbookedSlots = [];
  }

  ionViewWillEnter() {
    this.therapistId = Number(this.route.snapshot.params.id);
    this.schedules = [];
    this.unbookedSlots = [];
    const today = new Date();
    this.strToday = this.datepipe.transform(today, 'yyyy-MM-dd');
    this.selectedDate = this.strToday;
    const minAppointmentYear = today.getFullYear();
    this.maxAppointmentYear = minAppointmentYear + 1;
    this.selectedSchedule = null;
    this.bindAvailabilityDetails();
    this.onAppointmentDateChanged();
  }

  private bindAvailabilityDetails(): void {
    this.schedulesSer.getSchedulesByUserId(this.therapistId)
      .subscribe((res: Schedule[]) => {
        if (res) {
          this.schedules = res;
        }
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
  }

  onAppointmentDateChanged(): void {
    const sDate = this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.schedulesSer.getUnbookedSlots(this.therapistId, sDate)
      .subscribe((res: Schedule[]) => {
        if (res) {
          this.unbookedSlots = res;
        }
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
  }

  onTimeSlotSelected(data: any): void {
    const scheduleId = data.detail.value;
    if (scheduleId) {
      this.selectedSchedule = this.schedules.find(x => x.id === scheduleId);
    } else {
      this.selectedSchedule = null;
    }
  }

  onConfirmBtnClicked(): void {
    this.router.navigate(['echannel/checkout'],
    {queryParams: {requested_date: this.selectedDate, therapist_id: this.therapistId, schedule_id: this.selectedSchedule.id}});
  }

  back(): void {
    this.router.navigate(['echannel/therapist_profile', this.therapistId]);
  }
}
