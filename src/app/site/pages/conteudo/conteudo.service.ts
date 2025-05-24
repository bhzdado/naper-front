import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ResponseService } from 'src/app/services/response.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConteudoService {

  constructor(
    private httpClient: HttpClient, 
    private dialog: MatDialog,
    private respose: ResponseService,
    private router: Router) { }

  getConteudoPorModulo(modulo_id: number, params, callback: Function = null) {

    return this.httpClient.get<any>(environment.urlApi + 'modulo/conteudos/' + modulo_id, { params }).subscribe(
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

  getConteudo(conteudo_id: number, callback: Function = null) {
    return this.httpClient.get<any>(environment.urlApi + 'conteudo/' + conteudo_id).subscribe(
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
