// Angular import
import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

// project import
import { Spinkit } from './spinkits';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss', './spinkit-css/sk-line-material.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent {
  public texto: string = '';
  
  constructor(
    private router: Router,
    public loadingService: LoaderService
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.loadingService.setLoading(true);
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.loadingService.setLoading(false);
        }
      },
      () => {
        //this.isSpinnerVisible = false;
      }
    );
  }
}
