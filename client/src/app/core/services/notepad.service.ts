import { HttpClient } from '@angular/common/http';
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

  getNotepad(id: number): Observable<Notepad> {
    return this.http.get<Notepad>(this.baseUrl + id + '/');
  }

  getNotepads(): Observable<Notepad[]> {
    return this.http.get<Notepad[]>(this.baseUrl);
  }
}
