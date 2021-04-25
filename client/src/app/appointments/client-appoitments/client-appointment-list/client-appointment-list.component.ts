import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppoitmentUserDto } from 'src/app/core/dtos/appoitmentUserDto';
import { AlertService } from 'src/app/core/services/alert.service';
import { AppointmentsService } from 'src/app/core/services/appointments.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-client-appointment-list',
  templateUrl: './client-appointment-list.component.html',
  styleUrls: ['./client-appointment-list.component.scss']
})
export class ClientAppointmentListComponent implements OnInit {
  appointmentUserDtos?: AppoitmentUserDto[];
  imgUrl = '';
  searchClientName = '';

  constructor(
    private appointmentsSer: AppointmentsService,
    private alertify: AlertService,
    private mainRepo: RepositoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.imgUrl = '../../../assets/images/';
  }

  ionViewWillEnter() {
    this.bindAppointments();
    console.log('ionViewWillEnter');
  }

  private bindAppointments(): void {
    this.appointmentsSer.getAppointmentsToTherapist(this.mainRepo.loggedInUser.id)
    .subscribe((res: AppoitmentUserDto[]) => {
      this.appointmentUserDtos = res;
      console.log(this.appointmentUserDtos);
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  onClientAppointmentBtnClicked(id: number): void {
    this.router.navigate(['/appointments/client_appointment', id]);
  }

  back(): void {
    this.router.navigate(['home']);
  }

  get filteredAppointments(): AppoitmentUserDto[] {
    let ls = Object.assign([], this.appointmentUserDtos);
    if (this.searchClientName !== '') {
      ls = ls.filter(x => (x.client.firstName.trim().toLowerCase() + ' ' + x.client.lastName.trim().toLowerCase())
      .includes(this.searchClientName));
    }
    return ls;
  }

  getImg(gender: string): string {
    if (gender === 'male') {
      return 'client-male.png';
    } else if (gender === 'female'){
      return 'client-female.png';
    } else {
      return 'client-other.png';
    }
  }

  onChatWithClientBtnClicked(clientUserName: string): void {
    this.router.navigate(['/chats/chat_page', clientUserName]);
  }
}
