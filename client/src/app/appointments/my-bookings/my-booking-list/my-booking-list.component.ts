import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppoitmentUserDto } from 'src/app/core/dtos/appoitmentUserDto';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-my-booking-list',
  templateUrl: './my-booking-list.component.html',
  styleUrls: ['./my-booking-list.component.scss']
})
export class MyBookingListComponent implements OnInit {
  appointmentUserDtos?: AppoitmentUserDto[];

  constructor(
    private appointmentsSer: AppointmentsService,
    private alertify: AlertService,
    private mainRepo: RepositoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.bindAppointments();
  }

  private bindAppointments(): void {
    this.appointmentsSer.getAppointmentsByClient(this.mainRepo.loggedInUser.id)
    .subscribe((res: AppoitmentUserDto[]) => {
      this.appointmentUserDtos = res;
      console.log(this.appointmentUserDtos);
    }, error => {
      this.alertify.presentAlert('Error', error);
    })
  }

  onClientAppointmentBtnClicked(id: number): void {
    this.router.navigate(['/appointments/my_booking', id]);
  }
}
