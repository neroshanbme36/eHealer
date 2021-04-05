import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

constructor(private nav: NavController) { }

  navigate(tag: string): void {
    tag = tag.toLocaleLowerCase();
    if (tag === 'login') {
      this.nav.navigateRoot('/auth/login');
    }
  }
}
