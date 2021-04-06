import {Injectable} from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user';
import { AlertService } from '../services/alert.service';
import { RepositoryService } from '../services/repository.service';
import { UsersService } from '../services/users.service';

@Injectable({ providedIn: 'root'})

export class AuthUserResolver implements Resolve<User> {

    constructor(private repositoryService: RepositoryService, private usersService: UsersService,
                private router: Router, private alertify: AlertService) {}

    resolve(): Observable<User> {
        if (this.repositoryService.loggedInUser &&
            (this.repositoryService.loggedInUser.id === this.usersService.decodedToken.user_id)) {
                return Observable.create(observer => {
                    observer.next(this.repositoryService.loggedInUser);
                    observer.complete();
                    console.log('complete');
                });
        } else {
            return this.usersService.getUser(this.usersService.decodedToken.user_id).pipe(
                catchError(error => {
                    // this.alertify.error('Problem in retrieving data');
                    this.alertify.presentAlert('Error', error);
                    this.router.navigate(['/login']);
                    return of(null);
                })
            );
        }
    }
}
