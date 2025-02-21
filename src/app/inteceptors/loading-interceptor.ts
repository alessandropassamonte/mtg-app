import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, Observable } from "rxjs";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  requestsCount: number = 0;


  constructor(private spinnerService: NgxSpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if ((request.method == 'GET' || request.method == 'POST')) {
      this.requestsCount++;
      this.spinnerService.show();
      return next.handle(request).pipe(finalize(() =>
        this.hideSpinner()
      ));

    } else
      return next.handle(request)
  }

  hideSpinner() {
    this.requestsCount--;
    if (!this.requestsCount) {
      this.spinnerService.hide();
    }
  }
}
