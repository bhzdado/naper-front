import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './loader.service';
import { DialogModalComponent } from '../shared/dialog-modal/dialog-modal/dialog-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor(private dialog: MatDialog, private toastr: ToastrService, private loadingService: LoaderService) { }

  treatResponseWithoutMessage(response, $mensagem, callback: Function = null) {
    if (response.errors || response.status == 0) {
      const dialogRef = this.dialog.open(DialogModalComponent, {
        width: '400px',
        data: {
          titulo: 'ERRO',
          conteudo: response.message,
          tipo: "erro"
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (callback) {
          response.status = 0;
          callback(response, result);
        }
      });
    } else {
      if (callback) {
        callback(response);
      }
    }

    this.loadingService.setLoading(false);
  }

  treatResponse(response, $mensagem, callback: Function = null) {
    if (response.errors || response.status == 0) {
      const dialogRef = this.dialog.open(DialogModalComponent, {
        width: '400px',
        data: {
          titulo: 'ERRO',
          conteudo: response.message,
          tipo: "erro"
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (callback) {
          response.status = 0;
          callback(response, result);
        }
      });
    } else {
      this.toastr.success($mensagem, 'Tudo certo!');
      if (callback) {
        callback(response);
      }
    }

    this.loadingService.setLoading(false);
  }

  treatResponseError(error, callback: Function = null) {
    
  //   if (
  //     error.status == HttpStatusCode.NoContent ||
  //     error.status == HttpStatusCode.InternalServerError
  //   ) {
  //     const dialogRef = this.dialog.open(DialogModalComponent, {
  //       width: '400px',
  //       data: {
  //         titulo: '',
  //         conteudo: error.message,
  //         tipo: "erro"
  //       },
  //     });
  //   } else if (error.status == HttpStatusCode.Unauthorized) {
  //     window.location.href = "?" + (new Date()).getTime();
  //   } else {
  //     let erro_msg = error.message ? 'Erro na comunicação com a API. Tente novamente e caso persista o erro entre em contato com o administrador.\n\n [' +
  //       error.message +
  //       ']' : error.mensagem;

  //     const dialogRef = this.dialog.open(DialogModalComponent, {
  //       width: '400px',
  //       data: {
  //         titulo: '',
  //         conteudo: erro_msg,
  //         tipo: "erro"
  //       },
  //     });
  //   }
  //   return throwError(error);
  // })


    if (error.message) {
      const dialogRef = this.dialog.open(DialogModalComponent, {
        width: '400px',
        data: {
          titulo: '',
          conteudo: error.message,
          tipo: "erro"
        },
      });
    } else {
      const erros: Array<string> = [];
      Object.values(error.errors).forEach((value: any) => value.forEach((_: any) => erros.push(_)))

      const dialogRef = this.dialog.open(DialogModalComponent, {
        width: '400px',
        data: {
          titulo: '',
          conteudo: erros.toString().replace(new RegExp(',', 'g'), '\n'),
          tipo: "erro"
        },
      });
    }

    if (callback) {
      callback({ status: 0 });
    }
    this.loadingService.setLoading(false);
  }
}
