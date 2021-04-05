import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  model: any = {};
  constructor() { }

  ngOnInit() {}

  onSubmit(f: NgForm) {
    this.model.username = f.value.email;
    this.model.password = f.value.password;
    console.log(this.model);
  }
}
