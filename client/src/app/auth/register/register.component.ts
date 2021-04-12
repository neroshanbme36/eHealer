import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ChatFirebaseService } from 'src/app/core/services/chatFirebase.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerUser?: User;
  registerNext ?: number;
  repeatPassword?: string;
  isAgreePolicy: false;
  roleType = 'client';

  constructor(
    private repository: RepositoryService,
    private usersService: UsersService,
    private alertify: AlertService,
    private route: ActivatedRoute,
    private chatFirebaseSer: ChatFirebaseService
    ) { }

  ngOnInit() {
    this.registerUser = new User();
    this.registerNext = 0;
    this.repeatPassword = '';

    this.route.queryParams.subscribe((param) => {
      this.roleType = param.roleType;
    });
  }

  back(): void {
    this.registerNext = this.registerNext - 1;
    if (this.registerNext === -1) {
     this.repository.navigate('login');
     this.clearCustomer();
    }
 }

 clearCustomer(): void {
    this.registerUser = new User();
    this.registerNext = 0;
  }

  isRepeatPasswordMatch(): boolean {
    return this.registerUser.password.trim() ===
      this.repeatPassword.trim();
  }

  genderChange(event): void {
    this.registerUser.gender = event.detail.value;
  }

  mariralChange(event): void {
    this.registerUser.martialStatus = event.detail.value;
  }
  onSubmit() {
    this.registerUser.roleType = this.roleType;
    this.registerUser.birthDate = this.repository.getCsharpFormat(this.registerUser.birthDate, 'start');
    this.usersService.createUser(this.registerUser).subscribe((res: User) => {
      this.alertify.presentAlert('Success', 'User registered successfully');
    }, e => {
      this.alertify.presentAlert('Error', e);
    }, () => {
      this.chatFirebaseSer.signup(this.registerUser.username, this.registerUser.password)
      .then((user)=> {
        this.repository.navigate('login');
      }, async (err) => {
        await this.alertify.presentAlert('Sign up failed', err.message);
      })
    });
  }

  goToPrivacyPolicy() {
  }
}
