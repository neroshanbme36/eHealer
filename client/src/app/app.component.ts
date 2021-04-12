import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private usersService: UsersService, private afs: AngularFirestore) {}

  ngOnInit() {
    const token = localStorage.getItem('healerToken');
    if (token) {
      this.usersService.decodedToken = this.usersService.jwtHelper.decodeToken(token);
    }
  }
}
