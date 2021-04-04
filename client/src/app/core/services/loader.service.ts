import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderToShow: HTMLIonLoadingElement;

  constructor(public loadingController: LoadingController) {}

  async showLoader() {
    this.loaderToShow = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      backdropDismiss: false,
      duration: 2000 // Number of milliseconds to wait before dismissing the loading indicator.
    });
    await this.loaderToShow.present();
    await this.hideLoader();
  }

  async hideLoader() {
    await this.loaderToShow.dismiss();
    console.log('Loading dismissed!');
  }
}
