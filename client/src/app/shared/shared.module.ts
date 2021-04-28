import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PolicyComponent } from './components/policy/policy.component';
import { ContactUsFormComponent } from './components/contact-us-form/contact-us-form.component';

@NgModule({
  declarations: [
    // If component should be shared you need declare and export
    // Importantly dont declare in app.module.ts if you are going to share
    // You cant import component if u are connected with mainRepo
    PolicyComponent,
    ContactUsFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolicyComponent,
    ContactUsFormComponent
  ]
})

export class SharedModule { }
