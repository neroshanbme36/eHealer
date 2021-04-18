// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://192.168.8.101:8000/api/',
  // apiDomain: '192.168.8.101:8000',
  apiUrl: 'https://192.168.8.102:8000/api/',
  apiDomain: '192.168.8.102:8000',
  firebaseConfig: {
    apiKey: "AIzaSyDNr-hDfkkYmSnyIAkrfUNCZeGiikPdYPw",
    authDomain: "ehealer-887d2.firebaseapp.com",
    databaseURL: "https://ehealer-887d2-default-rtdb.firebaseio.com",
    projectId: "ehealer-887d2",
    storageBucket: "ehealer-887d2.appspot.com",
    messagingSenderId: "727499897049",
    appId: "1:727499897049:web:d966268744ba60ef86a6c8",
    measurementId: "G-8CR7CL023W"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
