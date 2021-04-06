import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private repository: RepositoryService,
    private usersService: UsersService
    ) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.route.data.subscribe(data => {
      this.repository.loggedInUser = data.authUser;
      console.log(this.repository.loggedInUser);
    });
  }
}
