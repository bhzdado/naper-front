import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, NgModule, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PapelService } from '../papel.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { provideNgxMask } from 'ngx-mask'
import {
  NgxViacepService,
} from "@brunoc/ngx-viacep";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalData } from 'src/app/interfaces/modalData';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseService } from 'src/app/services/response.service';

@Component({
  selector: 'app-add-papeis',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatTableModule, MatProgressBarModule, MatMenuModule, SharedModule, MatPaginatorModule,
    MatIconModule],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-papeis.component.html',
  styleUrls: ['./add-papeis.component.scss']
})
export default class AddPapeisComponent implements OnInit {
  public papel_id = null;
  public titulo = "Novo Papel";
  public acao: any = "adicao";
  public disabled: boolean = false;
  public papel: any;

  papelForm: {
    role: '',
  };

  public customPatterns = { '0': { pattern: new RegExp('\[0-9\]') } };

  constructor(
    private papelService: PapelService,
    private router: Router,
    private viacep: NgxViacepService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private toastr: ToastrService,
    private loadingService: LoaderService,
    private response: ResponseService
  ) {
    this.titulo = data.titulo;
    this.acao = data.acao ?? "adicao";
    this.papel_id = data?.item?.id??0;
  }

  ngOnInit(): void {
    if (this.papel_id) {
      this.carregaDadosPapel();
    }
  }

  carregaDadosPapel() {
    this.loadingService.setLoading(true);
    this.papelService.getPapel(this.papel_id).subscribe(
      (response: any) => {
        this.response.treatResponseWithoutMessage(response, response.mensagem, (response, result) => {
          this.papelForm.role = response.dados.nome;
        });
        this.loadingService.setLoading(false);
      });
  }

  create() {
    this.onNoClick();
    this.papelService.create(this.papelForm).subscribe(
      (response: any) => {
        this.response.treatResponse(response, response.mensagem);
        this.loadingService.setLoading(false);
        this.onNoClick();
      },
      (error) => {
        this.response.treatResponseError(error);
      });
  }

  editar() {
    this.onNoClick();
    this.papelService.update(this.papel_id, this.papelForm).subscribe(
      (response: any) => {
        this.response.treatResponse(response, response.mensagem);
      },
      (error) => {
        this.response.treatResponseError(error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  voltar() {
    this.router.navigate(['/papeis']);
  }
}
