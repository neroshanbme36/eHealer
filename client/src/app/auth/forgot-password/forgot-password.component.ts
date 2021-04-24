import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private usersSer: UsersService,
    private alertify: AlertService,
    private router: Router
  ) { }

  ngOnInit() {}

  onResetPasswordBtnClicked(username: string): void {
    this.usersSer.sendResetPasswordLink(username)
    .subscribe((res: void) => {
      this.alertify.presentAlert('Message', 'Password reset link has been sent to given email.');
      this.router.navigate(['/auth/login']);
    }, error => {
      this.alertify.presentAlert('Error', error);
    });
  }

  back(): void {
    this.router.navigate(['auth/login']);
  }
}
