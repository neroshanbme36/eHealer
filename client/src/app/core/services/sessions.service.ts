import { HttpClient } from '@angular/common/http';
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
    return this.http.post<Session>(this.baseUrl, model);
  }

  updateSession(model: Session): Observable<Session> {
    return this.http.put<Session>(this.baseUrl + model.id + '/', model);
  }

  getSession(id: number): Observable<Session> {
    return this.http.get<Session>(this.baseUrl + id + '/');
  }
}
