import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FavouriteTherapistDto } from '../dtos/favouriteTherapistDto';
import { FavouriteTherapist } from '../models/favouriteTherapist';

@Injectable({
  providedIn: 'root'
})
export class FavouriteTherapistsService {
  private baseUrl = environment.apiUrl + 'favourite_therapists/';

  constructor(private http: HttpClient) { }

  createFavTherapist(model: FavouriteTherapist): Observable<FavouriteTherapist> {
    return this.http.post<FavouriteTherapist>(this.baseUrl, model);
  }

  deleteFavTherapist(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + id + '/');
  }

  getFavTherapistByClientId(clientId: number): Observable<FavouriteTherapistDto[]> {
    let params = new HttpParams();
    params = params.append('client_id', clientId.toString());
    return this.http.get<FavouriteTherapistDto[]>(this.baseUrl + 'therapists_by_client_id/', {params});
  }

  favByTherapist_id(clientId: number, therapistId: number): Observable<FavouriteTherapistDto> {
    let params = new HttpParams();
    params = params.append('client_id', clientId.toString());
    params = params.append('therapist_id', therapistId.toString());
    return this.http.get<FavouriteTherapistDto>(this.baseUrl + 'fav_by_therapist_id/', {params});
  }
}
