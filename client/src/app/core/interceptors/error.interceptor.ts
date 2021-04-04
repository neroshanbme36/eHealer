import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Injectable()

// HttpInterceptor is an interface which we contract to our class
// Interface should implements method in our class which they poses
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    public loader: LoaderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loader.showLoader();
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        this.loader.hideLoader();
        return event;
      }),
      catchError(error => {
        this.loader.hideLoader();

        if (error.status === 0) {
          error.statusText = 'Network error';
          return throwError(error.statusText);
        }

        // 401 is the status code error which is general http protocol
        if (error.status === 401) {
          error.statusText = 'Unauthorized';
          return throwError(error.statusText); // Unauthorized
        }

        if (error.status === 404) {
          return throwError(error.statusText); //  Not found
        }

        if (error.status === 500) {
          return throwError(error.statusText); //  Internal server error
        }

        if (error.status === 503) {
          error.statusText = 'Service Unavailable';
          return throwError(error.statusText); // Service Unavailable Error
        }

        if (error.status === 504) {
          return throwError(error.statusText); // Gateway timedout
        }

        // The error causes due to http response in the api
        if (error instanceof HttpErrorResponse) {
          // Application error is provided by server or customer error in the application error header
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            return throwError(applicationError);
          }

          // serverError can be 500 internal server error
          const serverError = error;
          let modalStateErrors = '';
          // if the server error is of type object then it is the model state
          if (serverError.error && typeof serverError.error === 'object') {
            // Model in json will key value pair
            for (const key in serverError.error) {
              if (serverError.error[key]) {
                modalStateErrors += serverError.error[key] + '\n';
              }
            }
          }
          return throwError(modalStateErrors || serverError || 'Server Error');
        }
      })
    );
  }
}

export const ErrorInterceptorProvider  = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  // Add error response from server to interceptor array
  multi: true
};

// Important
// Finally add in app.module.ts
/*providers: [
  ErrorInterceptorProvider
]*/
