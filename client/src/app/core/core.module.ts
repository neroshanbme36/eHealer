import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, isPlatform } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorProvider } from './interceptors/error.interceptor';
import { BaseComponent } from './components/base/base.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

const getConfig = () => {
  let config = {
    // animated: false
  };

  if (isPlatform('android')) {
    config = {
      ...config,
      hardwareBackButton: true
    };
  }

  return config;
};

@NgModule({
  declarations: [
    BaseComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    IonicModule.forRoot(getConfig())
  ],
  providers: [
    ErrorInterceptorProvider,
    DatePipe
  ],
  exports: [
    IonicModule,
    HeaderComponent,
    FooterComponent
  ]
})

export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. You should only import Core modules in the AppModule only.');
    }
  }
}
