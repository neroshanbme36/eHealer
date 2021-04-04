import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule, isPlatform } from "@ionic/angular";
import { HttpClientModule } from '@angular/common/http';

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
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    IonicModule.forRoot(getConfig())
  ],
  providers: [],
  exports: [IonicModule]
})

export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. You should only import Core modules in the AppModule only.');
    }
  }
}
