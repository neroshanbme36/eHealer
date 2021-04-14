import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { RepositoryService } from './core/services/repository.service';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private afs: AngularFirestore,
    private router: Router,
    private repository: RepositoryService) {}

  ngOnInit() {
    const token = localStorage.getItem('healerToken');
    if (token) {
      this.usersService.decodedToken = this.usersService.jwtHelper.decodeToken(token);
    }


    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        // console.log('previous url', events[0].urlAfterRedirects);
        // console.log('current url', events[1].urlAfterRedirects);
        this.repository.previousUrl = events[0].urlAfterRedirects;
      });
  }
}
