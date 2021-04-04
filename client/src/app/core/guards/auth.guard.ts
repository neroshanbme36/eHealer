import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';;
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
    // this.repository.navigate('login');
    // this.alert.showErrorAlert('Authentication Failed', 'Please Login...', 'login');
    return res;
  }
}
