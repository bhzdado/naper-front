import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { ResponseService } from 'src/app/services/response.service';

@Injectable({
  providedIn: 'root'
})
export class PapelService {
  constructor(private httpClient: HttpClient, private dialog: MatDialog, private response: ResponseService) {

  }

  getAll(data?: any): Observable<any> {
    let params = {
      params: data,
    };

    return this.httpClient.get<any>(environment.urlApi + 'papeis', params);
  }

  getPapel(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'papeis/' + id).pipe(
      retry(0),
      catchError((error: any) => {
        this.response.treatResponse(error, error.message);
        return throwError(error);
      })
    );
  }

  create(payload: any) {
    return this.httpClient.post<any>(environment.urlApi + 'papeis', payload);
  }

  update(id: number, payload: any) {
    return this.httpClient.put(environment.urlApi + 'papeis/' + id, payload);
  }

  excluir(id: number, callback: Function = null) {
    return this.httpClient.delete(environment.urlApi + 'papeis/' + id).subscribe(
      (response: any) => {
        this.response.treatResponse(response, response.mensagem);
        if(callback){
          callback(response);
        }
      },
      (error) => {
        this.response.treatResponseError(error);
        return false;
      });
  }
}
