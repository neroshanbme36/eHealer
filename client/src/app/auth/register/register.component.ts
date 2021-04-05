import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { RepositoryService } from 'src/app/core/services/repository.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerUser?: User;
  registerNext ?: number;
  repeatPassword?: string;

  constructor(private repository: RepositoryService) { }

  ngOnInit() {
    this.registerUser = new User();
    this.registerNext = 0;
    this.repeatPassword = '';
  }

  back(): void {
    this.registerNext = this.registerNext - 1;
    if (this.registerNext === -1) {
     this.repository.navigate('login');
     this.clearCustomer();
    }
 }

 clearCustomer(): void {
    this.registerUser = new User();
    this.registerNext = 0;
  }

  isRepeatPasswordMatch(): boolean {
    return this.registerUser.password.trim() ===
      this.repeatPassword.trim();
  }

  genderChange(event): void {
    this.registerUser.gender = event.detail.value;
  }

  mariralChange(event): void {
    this.registerUser.martialStatus = event.detail.value;
  }
  onSubmit() {
    // set role type
    console.log(this.registerUser);
  }
}
