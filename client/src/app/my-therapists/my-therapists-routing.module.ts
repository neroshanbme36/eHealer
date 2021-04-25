import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTherapistListComponent } from './my-therapist-list/my-therapist-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/list', pathMatch: 'full' },
      {path: 'list', component: MyTherapistListComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTherapistsRoutingModule {}
