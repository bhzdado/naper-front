import { Directive, Input } from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';

export const DD_MM_YYYY_FORMAT = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' },
};

export const MM_YYYY_FORMAT = {
  parse: { dateInput: 'MM/YYYY' },
  display: { dateInput: 'MM/YYYY', monthYearLabel: 'MMMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' },
};

@Directive({
  selector: '[appDateFormat]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMAT }],
})
export class DateFormatDirective {
  @Input() set appDateFormat(format: 'DD_MM_YYYY' | 'MM_YYYY') {
    const customFormats = format === 'MM_YYYY' ? MM_YYYY_FORMAT : DD_MM_YYYY_FORMAT;
    // Sobrescreve o provedor MAT_DATE_FORMATS localmente na diretiva
    (this.dateFormats as any) = customFormats; // Acessa e modifica o valor do provedor injetado
    this.dateAdapter.setLocale('pt-BR'); // Garante que o locale seja PT-BR nesta diretiva
  }

  constructor(private dateAdapter: DateAdapter<any>, private dateFormats: any) {}
}
