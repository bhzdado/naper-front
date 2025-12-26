import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';

// Define o formato personalizado MM/YYYY
export const MM_YYYY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-datepicker-month-year',
    templateUrl: './datepicker-month-year.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatMomentDateModule,
        ReactiveFormsModule
    ],
    providers: [
        // Sobrescreve o MAT_DATE_FORMATS apenas para este componente e seus filhos
        { provide: MAT_DATE_FORMATS, useValue: MM_YYYY_FORMATS },
        // Garante que o adaptador use o locale correto (opcional, mas recomendado)
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } }
    ]
})
export class DatepickerMonthYearComponent {
    @Input() control!: FormControl; // Recebe o FormControl do pai
    @Input() label: string = 'Mês/Ano';

    // Define a view inicial do datepicker para 'multi-year'
    startView: 'month' | 'year' | 'multi-year' = 'multi-year';

    chosenYearHandler(normalizedMonthAndYear: Date) {
        console.log('entrou no year handler');
        console.log(this.control);
        console.log(this.control.value);
        const ctrlValue = this.control.value || new Date();
        ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
        this.control.setValue(ctrlValue);
    }

    chosenMonthHandler(event, datepicker: MatDatepicker<Date>) {
        datepicker.select(event);
        /*
        let ctrlValue = DateTime.fromObject({
            month: normalizedMonthAndYear.month,
            year: normalizedMonthAndYear.year,
        });

        const formattedDate = formatDate(ctrlValue, 'MM/yyyy', 'en-US');
        console.log(formattedDate);
        this.control.setValue(formattedDate);


        const ctrlValue = this.control.value || new Date();
        ctrlValue.setMonth(normalizedMonth.getMonth());
        this.control.setValue(ctrlValue);
*/
        // Feche o datepicker automaticamente após selecionar o mês
        datepicker.close();
    }
}
