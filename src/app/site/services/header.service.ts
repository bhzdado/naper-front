import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  // Inicializa com um valor padrão (cabeçalho visível)
  private showHeaderSource = new BehaviorSubject<boolean>(true);
  
  // Cria um Observable público para que outros componentes possam se inscrever
  showHeader$ = this.showHeaderSource.asObservable();

  // Método para atualizar o estado do cabeçalho
  toggleHeader(show: boolean) {
    this.showHeaderSource.next(show);
  }
}