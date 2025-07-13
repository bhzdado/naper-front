import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/services/response.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router: Router, private respose: ResponseService) {

  }

  isExternalPdf(urlPdf: any, callback: Function = null) {
    return this.httpClient.get<any>(environment.urlApi + 'isExternalPdf?url=' + btoa(urlPdf)).subscribe(
        (response: any) => {
          if (typeof callback === 'function') {
            callback(response);
          }
        },
        (error) => {
          if (typeof callback === 'function') {
            callback({ status: 0 });
          }
  
          this.respose.treatResponseError(error, callback);
          return false;
        });
  }

}
