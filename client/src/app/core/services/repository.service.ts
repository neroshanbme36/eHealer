import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  loggedInUser?: User;
  url?: string;

  constructor(private nav: NavController) { }

  navigate(tag: string): void {
    tag = tag.toLocaleLowerCase();
    if (tag === 'login') {
      this.nav.navigateRoot('/auth/login');
    } else if (tag === 'home') {
      this.nav.navigateRoot('/home');
    } else if (tag === 'account') {
      this.nav.navigateRoot('/account');
    }
  }

  get active(): string {
    this.url = location.pathname;
    const root = this.url.split('/');
    const len = root.length;
    if (len > 0) {
      return root[len - 1];
    } else {
      return 'home';
    }
  }
}
