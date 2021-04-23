import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notepad } from '../models/notepad';

@Injectable({
  providedIn: 'root'
})
export class NotepadService {
  private baseUrl = environment.apiUrl + 'notepads/';

  constructor(private http: HttpClient) { }

  createNotepad(model: Notepad): Observable<Notepad> {
    return this.http.post<Notepad>(this.baseUrl, model);
  }

  updateNotepad(model: Notepad): Observable<Notepad> {
    return this.http.put<Notepad>(this.baseUrl + model.id + '/', model);
  }

  deleteNotepad(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + id + '/');
  }

  getNotepad(id: number): Observable<Notepad> {
    return this.http.get<Notepad>(this.baseUrl + id + '/');
  }

  getNotepadsByUserId(userId: number): Observable<Notepad[]> {
    let params = new HttpParams();
    params = params.append('user_id', userId.toString());
    return this.http.get<Notepad[]>(this.baseUrl + 'notepads_by_user_id/', {params});
  }
}
