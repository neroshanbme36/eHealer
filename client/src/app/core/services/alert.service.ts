import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  ionicAlert?: HTMLIonAlertElement;

  constructor(private alertCtrl: AlertController) { }

  async presentAlert(heading: string, msg: string) {
    await this.presentIonicAlertConfirm(
      heading, msg,
      [
        {text: 'Cancel', role: 'cancel', cssClass: 'secondary', handler: () => {}},
        {text: 'Ok', handler: () => {}}
      ]
    );
  }

  async presentAlertConfirm(
    title: string, message: string, okBtnLabel: string, cancelBtnLabel: string,
    okCallback: () => any, cancelCallback: () => any) {
    await this.presentIonicAlertConfirm(
      title, message,
      [
        { text: cancelBtnLabel, role: 'cancel', cssClass: 'secondary', handler: () => { cancelCallback(); } },
        { text: okBtnLabel, handler: () => { okCallback(); } }
      ]
    );
  }

  async presentIonicAlertConfirm(heading: string, msg: string, btns: any[]) {
    this.ionicAlert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: heading,
      message: msg,
      backdropDismiss: false,
      buttons: btns
    });
    await this.ionicAlert.present();
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
