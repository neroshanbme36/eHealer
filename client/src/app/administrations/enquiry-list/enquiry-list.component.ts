import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerContactEnquiry } from 'src/app/core/models/customerContactEnquiry';
import { AlertService } from 'src/app/core/services/alert.service';
import { CustomerContactEnquiryService } from 'src/app/core/services/customerContactEnquiry.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.scss']
})
export class EnquiryListComponent implements OnInit {
  enquires?: CustomerContactEnquiry[];
  imgUrl = '';

  constructor(
    private cusContEnqSer: CustomerContactEnquiryService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.imgUrl = '../../../assets/images/';
    this.enquires = [];
    this.bindEnquires();
  }

  private bindEnquires(): void {
    this.cusContEnqSer.getCustomerContactEnquiries()
    .subscribe((res: CustomerContactEnquiry[]) => {
      this.enquires = res;
      console.log(res);
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  onCreateBtnClicked(): void {
    this.router.navigate(['/administrations/contact_us_new']);
  }

  onUpdateBtnClicked(id: number): void {
    this.router.navigate(['/administrations/contact_us_edit', id]);
  }

  back(): void {
    this.router.navigate(['/home']);
  }
}
