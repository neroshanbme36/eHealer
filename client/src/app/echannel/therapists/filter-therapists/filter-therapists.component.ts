import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    public modalController: ModalController,
    private echannelSer: EchannelService) { }

  ngOnInit() {
    this.searchTherapistName = '';
    this.searchSpecialization = '';
  }

  dismissModal(): void {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  onSearchBtnClicked(): void {
    this.echannelSer.searchTherapistName = this.searchTherapistName;
    this.echannelSer.searchSpecialization = this.searchSpecialization;
    this.dismissModal();
  }
}
