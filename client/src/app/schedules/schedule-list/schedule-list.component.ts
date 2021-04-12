import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Schedule } from 'src/app/core/models/schedule';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SchedulesService } from 'src/app/core/services/schedules.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {
  schedules?: Schedule[];
  filterByDay: string;

  constructor(
    private schedulesSer: SchedulesService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.filterByDay = '';
    this.bindSchedules();
  }

  private bindSchedules(): void {
    this.schedulesSer.getSchedulesByUserId(this.mainRepo.loggedInUser.id)
    .subscribe((res: Schedule[]) => {
      this.schedules = res;
    }, error => {
      this.alertify.presentAlert('Error', error);
    })
  }

  get filteredSchedules(): Schedule[] {
    if (this.schedules) {
      const fsch = this.schedules.sort((n1, n2) => {
        if (n1.dayOfWeek > n2.dayOfWeek) {
          return 1;
        }
        if (n1.dayOfWeek < n2.dayOfWeek) {
          return -1;
        }
        return 0;
      })
      if (this.filterByDay !== '') {
        return fsch.filter(x => x.day.trim().toLowerCase().includes(this.filterByDay.trim().toLowerCase()));
      } else {
        return fsch;
      }
    }
    return [];
  }

  onDeleteBtnClicked(sch: Schedule): void {
    const msg = 'Are you sure to delete Day:' + sch.day + ' Time:' + sch.openingTime + '-' + sch.closingTime + '?';
    this.alertify.presentAlertConfirm('Delete', msg, 'Ok', 'Cancel', () => {
        // ok call back
        this.schedulesSer.deleteSchedule(sch.id)
        .subscribe((res: void) => {}, error => {
          this.alertify.presentAlert('Error', error);
        }, () => {
          this.bindSchedules();
        })
      }, () => { // cancel call back});
    });
  }

  onCreateBtnClicked(): void {
    this.router.navigate(['schedules/new']);
  }

  onEditBtnClicked(id: number): void {
    this.router.navigate(['schedules/edit', id]);
  }
}
