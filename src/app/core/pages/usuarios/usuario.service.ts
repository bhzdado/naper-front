import { HttpClient, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient: HttpClient, private dialog: MatDialog,) {

  }

  getAll(data?: any): Observable<any> {
    let params = {
      params: data,
    };

    return this.httpClient.get<any>(environment.urlApi + 'usuarios', params);
  }

  getUsuario(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'usuarios/' + id).pipe(
      retry(0),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  create(payload: Usuario) {
    return this.httpClient.post<Usuario>(environment.urlApi + 'usuarios', payload);
  }

  update(id: number, payload: Usuario) {
    return this.httpClient.put<Usuario>(environment.urlApi + 'usuarios/' + id, payload);
  }

  inativarUsuario(id: number) {
    return this.httpClient.post<Usuario>(environment.urlApi + 'usuarios/inativarUsuario/' + id, null);
  }

  ativarUsuario(id: number) {
    return this.httpClient.post<Usuario>(environment.urlApi + 'usuarios/ativarUsuario/' + id, null);
  }
}
