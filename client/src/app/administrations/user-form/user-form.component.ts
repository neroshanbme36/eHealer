import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  user: User;

  constructor(
    private userSer: UsersService,
    private alertify: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new User();
  }

  ionViewWillEnter() {
    this.user = new User();
    const userId = this.route.snapshot.params.id;
    this.bindUser(userId);
  }

  private bindUser(userId: number): void {
    this.userSer.getUser(userId).subscribe((res: User) => {
      this.user = res;
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  back(): void {
    this.router.navigate(['/administrations/users'])
  }

  onUpdateBtnClicked(): void {
    this.userSer.updateUser(this.user).subscribe((res: User) => {
      this.user = res;
      this.alertify.presentAlert('Message', 'User profile updated successfullly.');
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }
}
