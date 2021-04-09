import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', redirectTo: '/schedules/list', pathMatch: 'full' },
      { path: 'list', component: ScheduleListComponent},
      { path: 'new', component: ScheduleFormComponent },
      { path: 'edit', component: ScheduleFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulesRoutingModule {}
