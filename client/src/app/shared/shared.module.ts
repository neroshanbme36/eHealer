import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    // If component should be shared you need declare and export
    // Importantly dont declare in app.module.ts if you are going to share
    // You cant import component if u are connected with mainRepo
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})

export class SharedModule { }
