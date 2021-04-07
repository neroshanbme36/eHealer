import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EchannelService {
  searchTherapistName: string;
  searchSpecialization: string;

  constructor() {
    this.searchTherapistName = '';
    this.searchSpecialization = '';
  }

}
