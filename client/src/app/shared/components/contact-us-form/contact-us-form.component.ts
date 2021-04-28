import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerContactEnquiry } from 'src/app/core/models/customerContactEnquiry';
import { AlertService } from 'src/app/core/services/alert.service';
import { CustomerContactEnquiryService } from 'src/app/core/services/customerContactEnquiry.service';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-contact-us-form',
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss']
})
export class ContactUsFormComponent implements OnInit {
  contactUs: CustomerContactEnquiry;
  isNewForm: boolean;

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertService,
    private router: Router,
    public mainRepo: RepositoryService,
    private cusContEnqSer: CustomerContactEnquiryService
  ) { }

  ngOnInit() {
    this.contactUs = new CustomerContactEnquiry();
  }

  ionViewWillEnter() {
    const path = this.route.snapshot.routeConfig.path;
    this.isNewForm = path.trim().toLowerCase() === 'contact_us_new' ? true : false;
    this.contactUs = new CustomerContactEnquiry();
    if (!this.isNewForm) {
      const enquiryId = this.route.snapshot.params.id;
      this.bindCustomerEnquiry(enquiryId);
    }
  }

  private bindCustomerEnquiry(id: number): void {
    this.cusContEnqSer.getCustomerContactEnquiry(id)
    .subscribe((res: CustomerContactEnquiry) => {
      this.contactUs = res;
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  onSubmitBtnClicked(): void {
    if (this.isNewForm) {
      this.cusContEnqSer.create(this.contactUs)
      .subscribe((res: CustomerContactEnquiry) => {
        this.contactUs = res;
        this.alertify.presentAlert('Message', 'Your enquiry is sent to our admin.');
        this.router.navigate(['']);
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    } else {
      this.contactUs.isAdminReplied = true;
      this.cusContEnqSer.update(this.contactUs)
      .subscribe((res: CustomerContactEnquiry) => {
        this.contactUs = res;
        this.alertify.presentAlert('Message', 'Email sent with your reply successfully.');
        this.router.navigate(['/administrations/enquiries']);
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    }
  }

  back(): void {
    this.router.navigate(['/administrations/enquiries']);
  }
}
