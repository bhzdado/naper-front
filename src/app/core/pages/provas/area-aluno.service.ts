import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProvaLiberada } from './prova-liberada';

@Injectable({
  providedIn: 'root'
})
export class AreaAlunoService {
  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router: Router) {

  }

  minhasProvasLiberadas(): Observable<ProvaLiberada[]> {
    return this.httpClient.get<ProvaLiberada[]>(environment.urlApi + 'area-aluno/avaliacoes-liberadas')
      // .pipe(
      //   retry(0),
      // );
      .pipe(
        map(responseData => {
          const postsArray: ProvaLiberada[] = [];

          if (responseData['status']) {
            responseData['dados'].forEach(element => {
              postsArray.push(element);
            });
          }

          return postsArray;
        }));
  }

  getUltimasAvalaiacoes(): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'area-aluno/utimas-avaliacoes');
  }

  getTotalAvalaiacoesRealizadas(): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'area-aluno/total-avaliacoes-realizadas');
  }

  aproveitamento(): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'area-aluno/aproveitamento');
  }

  getAvaliacao(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'area-aluno/dados-iniciais-avaliacao/' + id);
  }

  getQuestoesAvaliacao(prova_liberada_id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'area-aluno/questoes-avaliacao/' + prova_liberada_id);
  }

  iniciarAvaliacao(prova_liberada_id: number): Observable<any> {
    return this.httpClient.post<any>(environment.urlApi + 'area-aluno/iniciar-avaliacao/' + prova_liberada_id, null);
  }

  finalizarAvaliacao(prova_usuario_id: number, payload: any): Observable<any> {
    return this.httpClient.post<any>(environment.urlApi + 'area-aluno/finalizar-avaliacao/' + prova_usuario_id, payload);
  }

  getTermoConclusaoProva(prova_usuario_id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'relatorio/pdf/termoConclusaoProva/' + prova_usuario_id);
  }
}
