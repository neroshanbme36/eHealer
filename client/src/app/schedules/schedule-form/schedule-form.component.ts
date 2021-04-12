import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule } from 'src/app/core/models/schedule';
import { TherapistFee } from 'src/app/core/models/therapistFee';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SchedulesService } from 'src/app/core/services/schedules.service';
import { TherapistfeesService } from 'src/app/core/services/therapistfees.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss']
})
export class ScheduleFormComponent implements OnInit {
  schedule: Schedule;
  therapistFee: TherapistFee;
  isEditForm: boolean;
  today: Date;
  startDateIsoStr: string;
  endDateIsoStr: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private schedulesSer: SchedulesService,
    private alertify: AlertService,
    public mainRepo: RepositoryService,
    private therapistFeeSer: TherapistfeesService
  ) { }

  ngOnInit() {
    const url = this.router.url;
    const urlArr = url.split('/');
    if (urlArr.length >= 3) {
      this.isEditForm = urlArr[2].trim().toLowerCase() === 'edit' ? true : false;
    } else {
      this.router.navigate(['']);
    }
    this.schedule = new Schedule();
    this.therapistFee = new TherapistFee();
    this.today = new Date();
    this.startDateIsoStr = (this.today).toISOString();
    this.endDateIsoStr = (this.today).toISOString();
    this.bindScheduleDetails();
  }

  private bindScheduleDetails(): void {
    const errMsg = 'Please enter your fees details before proceeding to schedules.';
    this.therapistFeeSer.getTherapistFeeUserId(this.mainRepo.loggedInUser.id)
      .subscribe((res: TherapistFee) => {
        if (res) {
          this.therapistFee = res;
          // Adding end time in milliseconds
          this.endDateIsoStr = (new Date(this.today.getTime() + (this.therapistFee.slotDurationInMins * 60 * 1000))).toISOString();
        } else {
          this.alertify.presentAlert('Error', errMsg);
          this.router.navigate(['']);
        }
      }, error => {
        this.alertify.presentAlert('Error', errMsg);
        this.router.navigate(['']);
      }, () => {
        if (this.isEditForm) {
          const schId = this.route.snapshot.params.id;
          this.schedulesSer.getSchedule(schId)
            .subscribe((res: Schedule) => {
              if (res) {
                this.schedule = res;
                let timeArr = this.schedule.openingTime.split(':'); // HH:MM:SS
                this.startDateIsoStr = this.mainRepo.combineDateWithTime(this.today, new Date(1900, 1, 1, Number(timeArr[0]), Number(timeArr[1]), Number(timeArr[2]))).toISOString();
                timeArr = this.schedule.closingTime.split(':');
                this.endDateIsoStr = this.mainRepo.combineDateWithTime(this.today, new Date(1900, 1, 1, Number(timeArr[0]), Number(timeArr[1]), Number(timeArr[2]))).toISOString();
              } else {
                this.router.navigate(['']);
              }
            }, error => {
              this.alertify.presentAlert('Error', error);
              this.router.navigate(['']);
            })
        }
      })
  }

  onSaveBtnClicked(): void {
    this.schedule.day = this.mainRepo.daysDto.find(x => x.id === this.schedule.dayOfWeek).name;
    const startTime = new Date(this.startDateIsoStr);
    this.schedule.openingTime = startTime.getHours() + ':' + startTime.getMinutes() + ':' + '00';
    const endTime = new Date(this.endDateIsoStr);
    this.schedule.closingTime = endTime.getHours() + ':' + endTime.getMinutes() + ':' + '59';
    this.schedule.user = this.mainRepo.loggedInUser.id;
    if (this.isEditForm) {
      this.schedulesSer.updateSchedule(this.schedule)
        .subscribe((res: Schedule) => {
          this.schedule = res;
          this.alertify.presentAlert('Message', 'Schedule updated successfully');
        }, error => {
          this.alertify.presentAlert('Error', error);
        })
    } else {
      this.schedulesSer.createSchedule(this.schedule)
        .subscribe((res: Schedule) => {
          this.schedule = res;
          this.alertify.presentAlert('Message', 'Schedule saved successfully');
        }, error => {
          this.alertify.presentAlert('Error', error);
        }, () => {
          this.router.navigate(['schedules/edit', this.schedule.id]);
        })
    }
  }

  onStartTimeChanged(): void {
    this.endDateIsoStr = (new Date((new Date(this.startDateIsoStr).getTime()) + (this.therapistFee.slotDurationInMins * 60 * 1000))).toISOString();
  }
}