import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router: Router) {

  }

  getTotalAvaliacoesLiberadas(): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'dashboard/totalAvaliacoesLiberadas');
  }

  getTotalAvaliacoesExecutadasMes(): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'dashboard/totalAvaliacoesExecutadasMes');
  }

  getTotalQuestoesCadastradas(): Observable<any> {
    return this.httpClient.get<any>(environment.urlApi + 'dashboard/totalQuestoesCadastradas');
  }
}
