import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(
    public authService: AuthService,
    private loadingService: LoaderService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.setLoading(true);

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }
}