import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { RepositoryService } from '../services/repository.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private repository: RepositoryService) {}

  canActivate(): boolean {
    const res = false;
    // if (this.authService.isAuthenticated()) {
    //   return true;
    // }
    if (!res) {
      this.repository.navigate('login');
    }
    return res;
  }
}
