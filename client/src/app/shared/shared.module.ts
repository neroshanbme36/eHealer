import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    // If component should be shared you need declare and export
    // Importantly dont declare in app.module.ts if you are going to share
    // You cant import component if u are connected with mainRepo
    HeaderComponent
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
    HeaderComponent
  ]
})

export class SharedModule { }
