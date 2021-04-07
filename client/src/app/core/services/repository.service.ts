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
      this.nav.navigateBack('/auth/login');
    } else if (tag === 'home') {
      this.nav.navigateBack('/home');
    } else if (tag === 'account') {
      this.nav.navigateBack('/account');
    } else if (tag === 'my-profile') {
      this.nav.navigateBack('/account/my-profile');
    } else if (tag === 'register') {
      this.nav.navigateBack('/auth/register');
    } else if (tag === 'account-policy') {
      this.nav.navigateBack('/account/policy');
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

  public getCsharpFormat(d: string, tag: string ) {
    const ddd = d.split('T');
    const dd = ddd[0];
    // tslint:disable-next-line:variable-name
    const date_ = new Date(dd);
    const month = ('0' + (date_.getMonth() + 1)).slice(-2);
    const day  = ('0' + date_.getDate()).slice(-2);
    const hour = ('0' + date_.getHours()).slice(-2);
    const minutes = ('0' + date_.getMinutes()).slice(-2);
    if (tag === 'current') {
      return [ date_.getFullYear(), month, day ].join('-');
    } else if (tag === 'start') {
      return [ date_.getFullYear(), month, day ].join('-');
    } else if (tag === 'end') {
      return [ date_.getFullYear(), month, day ].join('-');
    }
  }
}
