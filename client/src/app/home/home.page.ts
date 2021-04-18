import { Component } from '@angular/core';
import { RepositoryService } from '../core/services/repository.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public mainRepo: RepositoryService) {}
}
