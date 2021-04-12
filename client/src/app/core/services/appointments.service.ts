import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppoitmentUserDto } from '../dtos/appoitmentUserDto';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private baseUrl = environment.apiUrl + 'appointments/';

  constructor(private http: HttpClient) { }

  createAppoitment(model: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, model);
  }

  updateAppointment(model: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(this.baseUrl + model.id + '/', model);
  }

  isAppointmentExist(requestedDate: string, scheduleId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('requested_date', requestedDate);
    params = params.append('schedule_id', scheduleId.toString());
    return this.http.get<any>(this.baseUrl + 'is_appointment_exist/', {params})
  }

  getAppoitment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(this.baseUrl + id + '/');
  }

  getAppointmentsByClient(clientId: number): Observable<AppoitmentUserDto[]> {
    let params = new HttpParams();
    params = params.append('user_id', clientId.toString());
    return this.http.get<AppoitmentUserDto[]>(this.baseUrl + 'appointments_by_client/', {params});
  }

  getAppointmentsToTherapist(therapistId: number): Observable<AppoitmentUserDto[]> {
    let params = new HttpParams();
    params = params.append('user_id', therapistId.toString());
    return this.http.get<AppoitmentUserDto[]>(this.baseUrl + 'appointments_to_therapist/', {params});
  }
}
