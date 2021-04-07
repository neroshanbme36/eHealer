import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TherapistFee } from '../models/therapistFee';

@Injectable({
  providedIn: 'root'
})
export class TherapistfeesService {
  private baseUrl = environment.apiUrl + 'therapistfees/';

  constructor(private http: HttpClient) { }

  createTherapistFee(model: TherapistFee): Observable<TherapistFee> {
    return this.http.post<TherapistFee>(this.baseUrl, model);
  }

  updateTherapistFee(model: TherapistFee): Observable<TherapistFee> {
    return this.http.put<TherapistFee>(this.baseUrl + model.id + '/', model);
  }

  getTherapistFee(id: number): Observable<TherapistFee> {
    return this.http.get<TherapistFee>(this.baseUrl + id + '/');
  }
}
