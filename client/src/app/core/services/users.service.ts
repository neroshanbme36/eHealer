import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtTokenDto } from '../dtos/jwtTokenDto';
import { LoginDto } from '../dtos/loginDto';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  private baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) { }

  login(dto: LoginDto): Observable<JwtTokenDto> {
    return this.http.post<JwtTokenDto>(environment.apiUrl + 'login/', dto);
  }

  loggedIn() {
    const token = localStorage.getItem('healerToken');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id + '/');
  }

  createUser(model: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'register/', model);
  }

  updateUser(model: User): Observable<User> {
    return this.http.put<User>(environment.apiUrl + 'update_user/' + model.id + '/', model);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + id + '/');
  }

  getUsersByRole(roleType: string, isActive: string): Observable<User[]> {
    let params = new HttpParams();
    params = params.append('role_type', roleType);
    params = params.append('is_active', isActive);
    return this.http.get<User[]>(this.baseUrl + 'users_by_role/', {params});
  }

  getUserByUsername(username: string): Observable<User> {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.get<User>(this.baseUrl + 'user_by_username/', {params});
  }

  sendResetPasswordLink(username: string): Observable<void> {
    let params = new HttpParams();
    params = params.append('username', username);
    console.log(username);
    return this.http.get<void>(this.baseUrl + 'send_password_link/', {params})
 }

 sendActivationEmail(id: number): Observable<void> {
  let params = new HttpParams();
  params = params.append('id', id.toString());
   return this.http.get<void>(this.baseUrl + 'send_activation_email/', {params});
 }
}
