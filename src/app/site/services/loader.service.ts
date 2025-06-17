import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingObs: Observable<boolean> = this.isLoading.asObservable();

  show() {
    this.isLoading.next(true);
    this.loadingObs.subscribe();
  }
  hide() {
    this.isLoading.next(false);
  }
}
