import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, signal, viewChild, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AsyncPipe } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNgxMask } from 'ngx-mask';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatAccordion } from '@angular/material/expansion';

interface selectInterface {
  value: string;
  viewValue: string;
}

export interface SubmenuItem {
  id?: number;
  titulo: string;
  descricao?: string;
  ordem: number;
  icone?: string;
  link?: string;
}

@Component({
  selector: 'app-configurar-menu',
  standalone: true,
  providers: [provideNgxMask()],
  imports: [MatButtonModule, FormsModule, MatProgressBarModule, MatMenuModule, SharedModule, AngularMaterialModule, AsyncPipe,
    AutocompleteLibModule, MatDatepickerModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, DragDropModule,
    CdkDrag, CdkDropList, MatTabsModule],
  templateUrl: './configurar-menu.component.html',
  styleUrl: './configurar-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class ConfigurarMenuComponent {
  selectedValue: string;
  value = '';
  submenus = [];

  color = "accent";

  menusForm: FormGroup;
  submitted = false;

  submenuItensFormArray = FormArray;
  submenuItensFormGroup: FormGroup;
  panels = [];
  totalSubmenuItens = [];

  step = signal(0);

  protected selectedTabIndex = 0;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  accordion = viewChild.required(MatAccordion);

  tipoMenu: selectInterface[] = [
    { value: 'stander', viewValue: 'Padrão' },
    { value: 'description', viewValue: 'Descrição' },
    { value: 'icon-des', viewValue: 'Icones' },
  ];

  classeMenu: selectInterface[] = [
    { value: 'mega', viewValue: 'Mega' },
    { value: 'drop-down', viewValue: 'Drop-Down' },
  ];

  constructor(private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.menusForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      classe: ['', Validators.required],
      ordem: ['', Validators.required],
      link: [''],
      submenus: new FormArray([])
    });

    // this.submenuItens = new FormGroup({
    //   userData: new FormGroup({
    //     username: new FormControl(null, [Validators.required]),
    //     email: new FormControl(null, [Validators.required, Validators.email])
    //   })
    // });
  }

  get getMenusForm() { return this.menusForm.controls; }
  get getSubmenusForm() { return this.getMenusForm['submenus'] as FormArray; }
  get submenusFormGroups() { return this.getSubmenusForm.controls as FormGroup[]; }

  getSubmenuItensFormArray(i: number) {
    return this.submenusFormGroups[i].controls['submenuItens'] as FormArray;
  }

  getSubmenuItensFormGroups(i: number) {
    return this.getSubmenuItensFormArray(i).controls as FormGroup[];
  }

  addSubmenu() {
    this.getSubmenusForm.push(this.formBuilder.group({
      titulo: ['', Validators.required],
      tipo: ['', [Validators.required]],
      ordem: [this.selectedTabIndex, [Validators.required]],
      link: [''],
      submenuItens: new FormArray([])
    }));

    this.submenus.push('Sem Título ' + (this.submenus.length + 1));
    this.selectedTabIndex = this.submenus.length - 1;

    this.totalSubmenuItens[this.selectedTabIndex] = 0;
  }

  removeSubmenu(index: number) {
    this.submenus.splice(index, 1);
    this.getSubmenusForm.removeAt(index);
  }

  addSubmenuItem(indice: number) {
    this.getSubmenuItensFormArray(indice).push(this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', [Validators.required]],
      ordem: [this.selectedTabIndex, [Validators.required]],
      icone: [''],
      link: ['']
    }));

    this.setStep(this.getSubmenuItensFormArray(indice).length -1);
  }

  removeSubmenuItem(index: number) {
    // this.submenus.splice(index, 1);
    // this.getSubmenusForm.removeAt(index);
  }

  preencherTituloSubmenu(index: number, event: any) {
    this.mudarTituloSubmenu(index, event.target.value);
  }

  mudarTituloSubmenu(index, novoTitulo) {
    this.submenus[index] = novoTitulo;
  }

  drop(event: CdkDragDrop<string[]>) {
    const array = this.getSubmenusForm.value;
    const prevActive = this.submenus[this.selectedTabIndex];

    moveItemInArray(array, event.previousIndex, event.currentIndex);

    array.forEach((x: any, i: number) => {
      x.ordem = i;
      if (x.titulo) {
        this.mudarTituloSubmenu(i, x.titulo);
      }
    });
    console.log(array);
    this.getSubmenusForm.setValue(array)
    console.log(array);
    this.selectedTabIndex = this.submenus.indexOf(prevActive);
  }

  dropAccordion(i: number, event: CdkDragDrop<string[]>) {
    let accordions = this.getSubmenuItensFormGroups(i);
    moveItemInArray(accordions, event.previousIndex, event.currentIndex);
  }

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }

  onSubmit() {

  }
}
