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
  searchTherapistName = '';
  searchTherapistSpecilization = '';
  imgUrl = '';

  constructor(
    private appointmentsSer: AppointmentsService,
    private alertify: AlertService,
    private mainRepo: RepositoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.bindAppointments();
    this.imgUrl = '../../../assets/therapists/';
  }

  private bindAppointments(): void {
    this.appointmentsSer.getAppointmentsByClient(this.mainRepo.loggedInUser.id)
    .subscribe((res: AppoitmentUserDto[]) => {
      this.appointmentUserDtos = res;
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  onClientAppointmentBtnClicked(id: number): void {
    this.router.navigate(['/appointments/my_booking', id]);
  }

  get filteredBookings(): AppoitmentUserDto[] {
    let ls = Object.assign([], this.appointmentUserDtos);
    if (this.searchTherapistName !== '') {
      ls = ls.filter(x => (x.therapist.firstName.trim().toLowerCase() + ' ' + x.therapist.lastName.trim().toLowerCase())
      .includes(this.searchTherapistName));
    }
    if (this.searchTherapistSpecilization !== '') {
      ls = ls.filter(x => (x.therapist.specialization.trim().toLowerCase())
      .includes(this.searchTherapistSpecilization));
    }
    return ls;
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

  onChatWithTherapistBtnClicked(therapistUserName: string): void {
    this.router.navigate(['/chats/chat_page', therapistUserName]);
  }
  back(): void {
    this.router.navigate(['home']);
  }
}
