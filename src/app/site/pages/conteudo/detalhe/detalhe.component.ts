import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { ConteudoService } from '../conteudo.service';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalhe.component.html',
  styleUrl: './detalhe.component.scss'
})
export class DetalheComponent {
  public id: number = 0;
  public titulo: string = "";
  public ultima_atualizacao: string = "";
  public conteudo: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
    public cdr: ChangeDetectorRef,
    public conteudoService: ConteudoService
  ) {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id')) ?? 0;

    this.getConteudo();
  }

  getConteudo() {
    this.loadingService.setLoading(true);

    this.conteudoService.getConteudo(this.id, (response) => {
      this.titulo = response.dados.titulo;
      this.ultima_atualizacao = response.dados.ultima_atualizacao;
      this.conteudo = (response.dados.conteudo);
      console.log(response);
      this.cdr.detectChanges();
      this.loadingService.setLoading(false);
    });
  }
}
