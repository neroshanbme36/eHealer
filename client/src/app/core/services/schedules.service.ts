import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Schedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private baseUrl = environment.apiUrl + 'schedules/';

  constructor(private http: HttpClient) { }

  createSchedule(model: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.baseUrl, model);
  }

  updateSchedule(model: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(this.baseUrl + model.id + '/', model);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + id + '/');
  }

  getSchedulesByUserId(userId: number): Observable<Schedule[]> {
    const params = new HttpParams();
    params.append('user_id', userId.toString());
    return this.http.get<Schedule[]>(this.baseUrl + 'schedules_by_user_id/', {params});
  }
}
