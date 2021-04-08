import { Component, OnInit } from '@angular/core';
import { EchannelService } from '../../echannel.service';

@Component({
  selector: 'app-filter-therapists',
  templateUrl: './filter-therapists.component.html',
  styleUrls: ['./filter-therapists.component.scss']
})
export class FilterTherapistsComponent implements OnInit {
  searchTherapistName: string;
  searchSpecialization: string;

  constructor(
    private echannelSer: EchannelService
    ) { }

  ngOnInit() {
    this.searchTherapistName = '';
    this.searchSpecialization = '';
  }

  onSearchBtnClicked(): void {
    this.echannelSer.searchTherapistName = this.searchTherapistName;
    this.echannelSer.searchSpecialization = this.searchSpecialization;
  }
}
