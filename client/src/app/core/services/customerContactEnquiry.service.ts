import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerContactEnquiry } from '../models/customerContactEnquiry';

@Injectable({
  providedIn: 'root'
})
export class CustomerContactEnquiryService {
  private baseUrl = environment.apiUrl + 'customer_contact_enquires/';

  constructor(private http: HttpClient) { }

  create(model: CustomerContactEnquiry): Observable<CustomerContactEnquiry> {
    return this.http.post<CustomerContactEnquiry>(this.baseUrl, model);
  }

  update(model: CustomerContactEnquiry): Observable<CustomerContactEnquiry> {
    return this.http.put<CustomerContactEnquiry>(this.baseUrl + model.id + '/', model);
  }

  getCustomerContactEnquiry(id: number): Observable<CustomerContactEnquiry> {
    return this.http.get<CustomerContactEnquiry>(this.baseUrl + id + '/');
  }

  getCustomerContactEnquiries(): Observable<CustomerContactEnquiry[]> {
    return this.http.get<CustomerContactEnquiry[]>(this.baseUrl);
  }
}
