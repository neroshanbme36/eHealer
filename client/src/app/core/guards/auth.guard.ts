import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { RepositoryService } from '../services/repository.service';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private repository: RepositoryService,
    private usersService: UsersService
    ) {}

  canActivate(): boolean {
    const res = false;
    if (this.usersService.loggedIn()) {
      return true;
    }
    this.repository.navigate('login');
    return res;
  }
}
