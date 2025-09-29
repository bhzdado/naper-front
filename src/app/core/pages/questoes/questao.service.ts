import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Questao } from './questao';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuestaoService {
  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router: Router) {

  }

  getAll(data?: any): Observable<any> {
    let params = {
      params: data,
    };

    return this.httpClient.get<any>(environment.urlApi + 'questoes', params);
  }

  getQuestao(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'questoes/' + id).pipe(
      retry(0),
      catchError((error: any) => {
        if (
          error.status == HttpStatusCode.NoContent ||
          error.status == HttpStatusCode.InternalServerError
        ) {
          const dialogRef = this.dialog.open(DialogModalComponent, {
            width: '400px',
            data: {
              titulo: '',
              conteudo: error.message,
              tipo: "erro"
            },
          });
        } else if (error.status == HttpStatusCode.Unauthorized) {
          //window.location.href = "?" + (new Date()).getTime();
          this.router.navigate(["/?" + (new Date()).getTime()]);
        } else {
          let erro_msg = error.message ? 'Erro na comunicação com a API. Tente novamente e caso persista o erro entre em contato com o administrador.\n\n [' +
            error.message +
            ']' : error.mensagem;

          const dialogRef = this.dialog.open(DialogModalComponent, {
            width: '400px',
            data: {
              titulo: '',
              conteudo: erro_msg,
              tipo: "erro"
            },
          });
        }
        return throwError(error);
      })
    );
  }

  create(payload: Questao) {
    return this.httpClient.post<Questao>(environment.urlApi + 'questoes', payload);
  }

  update(id: number, payload: Questao) {
    return this.httpClient.put<Questao>(environment.urlApi + 'questoes/' + id, payload);
  }

  excluir(id: number, callback: Function) {
    return this.httpClient.delete<Questao>(environment.urlApi + 'questoes/' + id).subscribe(
      (response: any) => {
        if (response.errors) {
          const dialogRef = this.dialog.open(DialogModalComponent, {
            width: '400px',
            data: {
              titulo: 'ERRO',
              conteudo: response.message,
              tipo: "erro"
            },
          });
        } else {
          const dialogRef = this.dialog.open(DialogModalComponent, {
            width: '400px',
            data: {
              titulo: 'PAPEL EXCLUIDO',
              conteudo: response.mensagem,
              tipo: "sucesso"
            },
          });

          if (typeof callback === 'function') {
            callback(response);
          }
          
        }
      },
      (error) => {
        console.log("Terra: ", error);
        const erros: Array<string> = [];
        let mensagem = "";
        if(error.errors.length > 1){
          Object.values(error.errors).forEach((value: any) => value.forEach((_: any) => erros.push(_)));
          mensagem = erros.toString().replace(new RegExp(',', 'g'), '\n');
        } else {
          mensagem = error.errors[0];
        }

        const dialogRef = this.dialog.open(DialogModalComponent, {
          width: '400px',
          data: {
            titulo: '',
            conteudo: mensagem,
            tipo: "erro"
          },
        });
        return false;
      });
  }
}
