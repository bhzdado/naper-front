import { HttpClient, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Categoria, Subcategoria } from './categoria';
import { catchError, retry, throwError } from 'rxjs';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';
import { ResponseService } from 'src/app/services/response.service';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {

  public dataResponse: any = null;

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private toastr: ToastrService, private loadingService: LoaderService,
    private respose: ResponseService
  ) {

  }

  getAll() {
    return this.httpClient.get<any>(environment.urlApi + 'categorias');
  }

  getCategoria(id, isSubcategoria = false, callback: Function = null) {
    if (isSubcategoria) {
      this.httpClient.get<any>(environment.urlApi + 'subcategorias/' + id).subscribe(
        (response: any) => {
          if (typeof callback === 'function') {
            callback(response);
          }
          //this.respose.treatResponse(response, "Categoria criada com sucesso.");
        },
        (error) => {
          
          this.respose.treatResponseError(error, callback);
          return false;
        });
    } else {
      this.httpClient.get<any>(environment.urlApi + 'categorias/' + id).subscribe(
        (response: any) => {
          if (typeof callback === 'function') {
            callback(response);
          }
        },
        (error) => {
          this.respose.treatResponseError(error, callback);
          return false;
        });
    }

  }

  createCategory(payload: Categoria) {
    return this.httpClient.post<Categoria>(environment.urlApi + 'categorias', payload).subscribe(
      (response: any) => {
        this.respose.treatResponse(response, "Categoria criada com sucesso.");
      },
      (error) => {
        this.respose.treatResponseError(error);
        return false;
      });
  }

  createSubCategory(categoria_id: any, payload: Subcategoria) {
    return this.httpClient.post<Subcategoria>(environment.urlApi + 'subcategorias/' + categoria_id, payload).subscribe(
      (response: any) => {
        this.respose.treatResponse(response, "Subcategoria criada com sucesso.");
      },
      (error) => {
        this.respose.treatResponseError(error);
        return false;
      });
  }

  updateCategory(categoria_id: number, payload: Categoria) {
    return this.httpClient.put<Categoria>(environment.urlApi + 'categorias/' + categoria_id, payload).subscribe(
      (response: any) => {
        this.respose.treatResponse(response, "Categoria alterada com sucesso.");
        return true;
      },
      (error) => {
        this.respose.treatResponseError(error);
        return false;
      });
  }

  updateSubcategory(subcategoria_id: number, payload: Subcategoria, callback: Function = null) {
    return this.httpClient.put<Subcategoria>(environment.urlApi + 'subcategorias/' + subcategoria_id, payload).subscribe(
      (response: any) => {
        this.respose.treatResponse(response, "Subcategoria alterada com sucesso.");
        if (typeof callback === 'function') {
          callback(response);
        }
      },
      (error) => {
        this.respose.treatResponseError(error, callback);
        return false;
      });
  }

  changeCategory(subcategoria_id: number, payload: Subcategoria, callback: Function = null) {
    return this.httpClient.put<Subcategoria>(environment.urlApi + 'subcategorias/change/' + subcategoria_id, payload).subscribe(
      (response: any) => {
        this.respose.treatResponse(response, "Subcategoria alterada com sucesso.");
        if (typeof callback === 'function') {
          callback(response);
        }
      },
      (error) => {
        this.respose.treatResponseError(error, callback);
        return false;
      });
  }

  excluirCategoria(id: number, callback: Function) {
    this.httpClient.delete<Categoria>(environment.urlApi + 'categorias/' + id).subscribe(
      (response: any) => {
        this.respose.treatResponse(response, "Categoria removida com sucesso.");
        if (typeof callback === 'function') {
          callback(response);
        }
      },
      (error) => {
        this.respose.treatResponseError(error, callback);
      });
  }

  async excluirSubcategoria(id: number, callback: Function) {
    this.httpClient.delete<Categoria>(environment.urlApi + 'subcategorias/' + id).subscribe(
      (response: any) => {
        this.respose.treatResponse(response, "Exclusão de subcategoria finalizada com sucesso.");
        if (typeof callback === 'function') {
          callback(response);
        }
      },
      (error) => {
        this.respose.treatResponseError(error, callback);
      });
    return this.dataResponse;
  }
}