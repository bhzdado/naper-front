import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
export interface ModalData {
  titulo: string,
  conteudo: string,
  tipo: string,
  cancelText: string,
  confirmText: string,
  dataModalSelect: {
    rota: string,
    selecionados: [],
    selectedItem: any,
    campos: []
  }
}

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.scss']
})
export class DialogModalComponent implements OnInit {
  background: string = 'darkseagreen';
  icone: string = "";
  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {
    if(!data.cancelText){
      if(data.confirmText){
        data.cancelText = "Cancelar";
      } else {
        data.cancelText = "Ok";
      }
    }

    switch (data.tipo) {
      case 'sucesso':
        this.background = 'darkseagreen';
        this.icone = "task_alt";
        break;
      case 'erro':
        this.background = 'brown';
        this.icone = "error";
        break;
        case 'confirmacao':
          this.background = 'cornflowerblue';
          this.icone = "question_mark";
          break;
    }
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  ngOnInit() { }
}