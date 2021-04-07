import { Component, OnInit } from '@angular/core';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public service: RepositoryService) { }

  ngOnInit() {
  }

  navigate(path: string) {
    this.service.navigate(path);
  }
}
