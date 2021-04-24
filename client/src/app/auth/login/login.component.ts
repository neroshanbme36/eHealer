import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtTokenDto } from 'src/app/core/dtos/jwtTokenDto';
import { LoginDto } from 'src/app/core/dtos/loginDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ChatFirebaseService } from 'src/app/core/services/chatFirebase.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(
    private repository: RepositoryService,
    private usersService: UsersService,
    private alertify: AlertService,
    private chatFirebaseSer: ChatFirebaseService
  ) { }

  ngOnInit() { }

  onSubmit(f: NgForm) {
    const dto: LoginDto = new LoginDto();
    dto.username = f.value.email;
    dto.password = f.value.password;

    this.usersService.login(dto).subscribe((res: JwtTokenDto) => {
      localStorage.setItem('healerToken', res.access);
      this.usersService.decodedToken = this.usersService.jwtHelper.decodeToken(res.access);
    }, error => {
      this.alertify.presentAlert('Error', error);
    }, () => {
      const userId = this.usersService.decodedToken.user_id;
      this.usersService.getUser(userId).subscribe((res: User) => {
        this.chatFirebaseSer.signIn(res.email, res.firebasePassword)
          .then((res) => {
            this.repository.navigate('home');
          }, async (err) => {
            await this.alertify.presentAlert(':(', err.message);
          }
          );
      }, error => {
        this.alertify.presentAlert('Error', error);
      });
    });
  }
}
