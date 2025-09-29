import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { Router } from '@angular/router';
import { Prova } from './prova';
import { ProvaLiberada } from './prova-liberada';

@Injectable({
  providedIn: 'root'
})
export class ProvaService {
  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router: Router) {

  }

  getAll(data?: any): Observable<any> {
    let params = {
      params: data,
    };

    return this.httpClient.get<any>(environment.urlApi + 'provas', params);
  }

  getProva(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'provas/' + id).pipe(
      retry(0),
    );
  }

  create(payload: Prova) {
    return this.httpClient.post<Prova>(environment.urlApi + 'provas', payload);
  }

  update(id: number, payload: Prova) {
    return this.httpClient.put<Prova>(environment.urlApi + 'provas/' + id, payload);
  }

  excluir(id: number, callback: Function) {
    return this.httpClient.delete<Prova>(environment.urlApi + 'provas/' + id).subscribe(
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


  getAllProvaLiberadas(data?: any): Observable<any> {
    let params = {
      params: data,
    };

    return this.httpClient.get<any>(environment.urlApi + 'provas-liberacao', params);
  }

  liberaProva(payload: any) {
    return this.httpClient.post<any>(environment.urlApi + 'provas-liberacao', payload);
  }

  alterarLiberacao(id: number, payload: ProvaLiberada) {
    return this.httpClient.put<Prova>(environment.urlApi + 'provas-liberacao/' + id, payload);
  }

  getProvaLiberacao(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'provas-liberacao/' + id).pipe(
      retry(0),
    );
  }

  excluirLiberacao(id: number, callback: Function) {
    return this.httpClient.delete<Prova>(environment.urlApi + 'provas-liberacao/' + id).subscribe(
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
              titulo: 'LIBERAÇÃO EXCLUIDA',
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
