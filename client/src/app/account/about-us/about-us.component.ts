import { Component, OnInit } from '@angular/core';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  constructor(private repository: RepositoryService) { }

  ngOnInit() {
  }

  back() {
    this.repository.navigate('account');
  }
}
