import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers, Storage } from '@ionic/storage';
import { JwtModule } from '@auth0/angular-jwt';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

export function tokenGetter() {
  const token = localStorage.getItem('healerToken');
  if (this.jwtHelper.isTokenExpired(token)) {
    const url = location.pathname;
    // if (!url.endsWith('login')) {
    //    location.reload();
    // }
  }
  return token;
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    IonicStorageModule.forRoot({
      name: 'eHealer',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
          tokenGetter,
          allowedDomains: [environment.apiDomain],
          disallowedRoutes: [environment.apiDomain + 'api/login/'] // this will send without token
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
