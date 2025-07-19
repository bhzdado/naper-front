import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/services/response.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalculadoraService {

  constructor(
    private httpClient: HttpClient, 
    private respose: ResponseService) { }

  getCalculadora(calculadora_id: number, callback: Function = null) {
    return this.httpClient.get<any>(environment.urlApi + 'calculadora/' + calculadora_id).subscribe(
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
