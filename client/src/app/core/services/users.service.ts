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

  getUsersByRole(roleType: string, isActive: boolean): Observable<User[]> {
    const params = new HttpParams();
    params.append('role_type', roleType);
    params.append('is_active', isActive.toString());
    return this.http.get<User[]>(this.baseUrl + 'users_by_role/', {params});
  }
}
