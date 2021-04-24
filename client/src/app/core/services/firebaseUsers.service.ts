import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FirebaseUser } from '../models/firebaseUser';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUsersService {
  private baseUrl = environment.apiUrl + 'firebase_users/';

  constructor(private http: HttpClient) { }

  createUser(model: FirebaseUser): Observable<FirebaseUser> {
    return this.http.post<FirebaseUser>(this.baseUrl, model);
  }

  getUserByUserId(userId: number): Observable<FirebaseUser> {
    let params = new HttpParams();
    params = params.append('user_id', userId.toString());
    return this.http.get<FirebaseUser>(this.baseUrl + 'firebase_user_by_user_id/', {params});
  }
}
