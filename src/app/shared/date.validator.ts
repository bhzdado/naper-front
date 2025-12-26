import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function mmYYYYValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value;

    if (!value) {
      return null; // Não valida campos vazios (se for obrigatório, use Validators.required separadamente)
    }

    if(value.length == 6){
        value = value.substr(0, 2) + '/' + value.substr(-4)
    }

    // Regex para o formato MM/YYYY
    const pattern = /^(0[1-9]|1[0-2])\/\d{4}$/;

    if (!pattern.test(value)) {
      return { 'mmYYYYFormat': { value: control.value } }; // Erro de formato
    }

    // Verificação de data válida (opcional, mas recomendado)
    const parts = value.split('/');
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    // Cria uma data com o primeiro dia do mês.
    // O JavaScript Date object usa mês baseado em zero (0-Jan, 1-Feb, etc.)
    const date = new Date(year, month - 1, 1);

    // Verifica se o mês e o ano extraídos do objeto Date correspondem aos originais
    if (date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return { 'invalidDate': { value: control.value } }; // Erro de data inválida (ex: mês 13)
    }

    return null; // Válido
  };
}
