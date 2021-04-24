import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent
  ]
})
export class AuthModule {}
