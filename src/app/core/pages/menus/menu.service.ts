import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/services/response.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router: Router, private respose: ResponseService) {

  }

  create(payload: any) {
    return this.httpClient.post<any>(environment.urlApi + 'menus', payload);
  }

  update(id: number, payload: any) {
    return this.httpClient.put<any>(environment.urlApi + 'menus/alterar/' + id, payload);
  }

  alterarOrdem(payload: any, callback: Function = null) {
    return this.httpClient.put<any>(environment.urlApi + 'menus/salvaOrdem', { ordens: payload });
  }

  removerMenu(id: number) {
    return this.httpClient.delete<any>(environment.urlApi + 'menus/' + id);
  }

  getTodosMenus(callback: Function = null) {
    this.httpClient.get<any>(environment.urlApi + 'menus').subscribe(
            (response: any) => {
              if (typeof callback === 'function') {
                callback(response);
              }
            },
            (error: any) => {
              // if (typeof callback === 'function') {
              //   callback({ status: 0 });
              // }
      console.log(error);
              this.respose.treatResponseError(error, callback);
              return false;
            }
    );
  }

  getMenu(id: number, callback: Function = null) {
    this.httpClient.get<any>(environment.urlApi + 'menus/' + id).subscribe(
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
