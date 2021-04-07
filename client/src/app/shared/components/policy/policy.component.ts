import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {
  roleType = null;
  constructor(private nav: NavController, private route: ActivatedRoute, private repository: RepositoryService) { }

  ngOnInit() {
  }

  back() {
    const segments = this.route.snapshot.url;
    console.log(segments);
    let path = '';
    if (segments.length >= 2) {
      path = segments[segments.length - 2].path;
    } else if (segments.length === 1) {
      path = 'account';
    }
    console.log(path);
    this.route.queryParams.subscribe((param) => {
      this.roleType = param.roleType;
      if (this.roleType) {
        this.nav.navigateBack(['/auth/register'], { queryParams: { roleType: this.roleType }});
      } else {
        this.repository.navigate(path);
      }
    });
  }
}
