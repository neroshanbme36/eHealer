import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  private baseUrl = environment.apiUrl + 'sessions/';

  constructor(private http: HttpClient) { }

  createSession(model: Session): Observable<Session> {
    const formData = new FormData();
    formData.append('summary', model.summary);
    formData.append('appointment', model.appointment.toString());
    formData.append('client', model.client.toString());
    formData.append('therapist', model.therapist.toString());
    formData.append('file', model.file);

    return this.http.post<Session>(this.baseUrl, formData);
  }

  updateSession(model: Session): Observable<Session> {
    return this.http.put<Session>(this.baseUrl + model.id + '/', model);
  }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(this.baseUrl + id + '/');
  }

  getSessionByAppointmentId(appointmentId: number): Observable<Session> {
    let params = new HttpParams();
    params = params.append('appointment_id', appointmentId.toString());
    return this.http.get<Session>(this.baseUrl + 'session_by_appointment/', {params});
  }
}
