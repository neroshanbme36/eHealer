import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtTokenDto } from 'src/app/core/dtos/jwtTokenDto';
import { LoginDto } from 'src/app/core/dtos/loginDto';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { StorageService } from 'src/app/core/services/storage.service';
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
    private alertify: AlertService
    ) { }

  ngOnInit() {}

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
      this.repository.navigate('home');
    });
  }
}
