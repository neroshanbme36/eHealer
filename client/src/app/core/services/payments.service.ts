import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private baseUrl = environment.apiUrl + 'payments/';

  constructor(private http: HttpClient) { }

  createPayment(model: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, model);
  }

  updatePayment(model: Payment): Observable<Payment> {
    return this.http.put<Payment>(this.baseUrl + model.id + '/', model);
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(this.baseUrl + id + '/');
  }
}
