import { NgModule } from '@angular/core';
import { MyTherapistListComponent } from './my-therapist-list/my-therapist-list.component';
import { SharedModule } from '../shared/shared.module';
import { MyTherapistsRoutingModule } from './my-therapists-routing.module';

@NgModule({
  imports: [
    SharedModule,
    MyTherapistsRoutingModule
  ],
  declarations: [MyTherapistListComponent]
})
export class MyTherapistsModule {}
