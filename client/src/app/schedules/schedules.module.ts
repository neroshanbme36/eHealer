import { NgModule } from '@angular/core';
import { SchedulesRoutingModule } from './schedules-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';

@NgModule({
  imports: [
    SharedModule,
    SchedulesRoutingModule
  ],
  declarations: [
    ScheduleListComponent,
    ScheduleFormComponent
  ]
})
export class SchedulesModule {}
