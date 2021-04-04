import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl: AlertController) { }

  async presentAlert(heading: string, msg: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: heading,
      subHeader: 'Subtitle',
      message: msg,
      backdropDismiss: false,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirm(heading: string, msg: string, okBtnTxt: string,
     okCallback: () => any, cancelCallback: () => any) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: heading,
      message: msg,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            cancelCallback();
          }
        }, {
          text: okBtnTxt,
          handler: () => {
            okCallback();
          }
        }
      ]
    });

    await alert.present();
  }

  // showExitAlert(): void {
  //   this.alertCtrl.create({
  //     header: 'Exit',
  //     message: 'Do you want to exit?',
  //     cssClass: 'alertDanger',
  //     buttons: [{
  //       text: 'cancel',
  //       role: 'cancel',
  //       cssClass: 'alert-danger'
  //     }, {
  //       text: 'exit',
  //       cssClass: 'alert-secondary',
  //       handler: () => {
  //         (navigator as any).app.exitApp();
  //       }
  //     }]
  //   }).then(alertEl => {
  //     alertEl.present();
  //   });
  // }
}
