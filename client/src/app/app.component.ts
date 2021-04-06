import { Component, OnInit } from '@angular/core';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private usersService: UsersService) {}

  ngOnInit() {
    const token = localStorage.getItem('healerToken');
    if (token) {
      this.usersService.decodedToken = this.usersService.jwtHelper.decodeToken(token);
    }
  }
}
