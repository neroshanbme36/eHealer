import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id + '/');
  }

  createUser(model: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, model);
  }

  updateUser(model: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + model.id + '/', model);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + id + '/');
  }
}
