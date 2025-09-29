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
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../menu.service';
import { QuestaoService } from '../../questoes/questao.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ResponseService } from 'src/app/services/response.service';

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
  public id: any = 0;

  selectedValue: string;
  value = '';
  submenus = [];
  submenuItens = [];

  panelOpenState = true;

  color = "accent";

  menusForm: FormGroup;
  submitted = false;

  submenuItensFormArray = FormArray;
  submenuItensFormGroup: FormGroup;
  panels = [];
  totalSubmenuItens = [];

  stepSubmenu = signal(0);
  stepSubmenuItem = signal(0);

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
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private loadingService: LoaderService,
    private response: ResponseService,
    private router: Router,
    private cdr: ChangeDetectorRef) { 
      this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? 0;
    }

  ngOnInit() {
    this.menusForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      classe: [''],
      ordem: [''],
      link: [''],
      submenus: new FormArray([])
    });

    if (this.id) {
      this.carregaDadosMenu();
    }
  }

  carregaDadosMenu() {
    this.loadingService.setLoading(true);

    this.menuService.getMenu(this.id, (response)=> {
      this.menusForm.setValue({
        titulo: response.dados.titulo, 
        classe: response.dados.classe, 
        ordem: response.dados.ordem, 
        link: response.dados.link,
        submenus: []
      });

      if(response.dados.submenus){
        response.dados.submenus.forEach((x: any, i: number) => {
          this.addSubmenu(x);

          if(x.submenuItens){
            x.submenuItens.forEach((y: any, k: number) => {
              if(x.submenuItens){
                this.addSubmenuItem(i, y);
              }
            });
          }
        });
      }
      
      this.setstepSubmenu(-1);
      this.loadingService.setLoading(false);
    });
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


  addSubmenu(submenu:any = null) {
    this.getSubmenusForm.push(this.formBuilder.group({
      titulo: [submenu?.titulo, Validators.required],
      tipo: [submenu?.tipo, [Validators.required]],
      ordem: [this.selectedTabIndex, [Validators.required]],
      link: [submenu?.link],
      submenuItens: new FormArray([])
    }));

    this.submenus.push((submenu?.titulo) ? submenu.titulo : '2º nível Sem Título ' + (this.submenus.length + 1));
    this.selectedTabIndex = this.submenus.length - 1;

    this.totalSubmenuItens[this.selectedTabIndex] = 0;
    this.setstepSubmenu(this.selectedTabIndex);
    this.submenuItens.push([]);
  }

  addSubmenuItem(indice: number, submenuItem:any = null) {
    this.getSubmenuItensFormArray(indice).push(this.formBuilder.group({
      titulo: [submenuItem?.titulo, Validators.required],
      descricao: [submenuItem?.descricao],
      ordem: [this.selectedTabIndex],
      icone: [submenuItem?.icone],
      link: [submenuItem?.link]
    }));

    this.submenuItens[indice][this.submenuItens[indice].length] = (submenuItem?.titulo) ? submenuItem?.titulo : '3º nivel Sem Título ' + (this.submenuItens[indice].length + 1);
    // console.log(this.submenuItens);
    this.setstepSubmenuItem(this.getSubmenuItensFormArray(indice).length - 1);
  }

  getTituloSubmenuItem(i, indiceItem) {
    return this.submenuItens[i][indiceItem];
  }

  preencherTituloSubmenu(index: number, event: any) {
    this.mudarTituloSubmenu(index, event.target.value);
  }

  preencherTituloSubmenuItem(index: number, indiceItem: number, event: any) {
    this.mudarTituloSubmenuItem(index, indiceItem, event.target.value);
  }

  mudarTituloSubmenu(index, novoTitulo) {
    this.submenus[index] = novoTitulo;
  }

  mudarTituloSubmenuItem(index, indiceItem, novoTitulo) {
    this.submenuItens[index][indiceItem] = novoTitulo;
  }

  dropSubmenu(event: CdkDragDrop<string[]>) {
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;

    const from = event.previousIndex;
    const to = event.currentIndex;

    const temp = this.getSubmenusForm.at(from);

    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = this.getSubmenusForm.at(i + dir);
      this.getSubmenusForm.setControl(i, current);
    }
    this.getSubmenusForm.setControl(to, temp);

    const array = this.getSubmenusForm.value;
    array.forEach((x: any, i: number) => {
      x.ordem = i;
      if (x.titulo) {
        this.mudarTituloSubmenu(i, x.titulo);
      }
    });
  }

  dropSubmenuItem(indice: number, event: CdkDragDrop<string[]>) {
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;

    const from = event.previousIndex;
    const to = event.currentIndex;

    const temp = this.getSubmenuItensFormArray(indice).at(from);

    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = this.getSubmenuItensFormArray(indice).at(i + dir);
      this.getSubmenuItensFormArray(indice).setControl(i, current);
    }
    this.getSubmenuItensFormArray(indice).setControl(to, temp);

    const array = this.getSubmenuItensFormArray(indice).value;
    array.forEach((x: any, indiceItem: number) => {
      x.ordem = indiceItem;
      if (x.titulo) {
        this.mudarTituloSubmenuItem(indice, indiceItem, x.titulo);
      }
    });
  }

  setstepSubmenu(index: number) {
    this.stepSubmenu.set(index);
  }

  setstepSubmenuItem(index: number) {
    this.stepSubmenuItem.set(index);
  }

  removeSubmenu(index: number) {
    this.submenus.splice(index, 1);
    this.getSubmenusForm.removeAt(index);
  }

  removeSubmenuItem(index: number, indiceItem: number) {
    this.submenuItens[index].splice(indiceItem, 1);
    this.getSubmenuItensFormArray(index).removeAt(indiceItem);
  }

  tipoSegundoNivel(i, event){
    console.log(event.source.value);
  }

  voltar(){
    this.router.navigate(['/admin/menus']);
  }

  onSubmit() {
    const formValue = this.menusForm.getRawValue();

    if (this.id) {
      this.menuService.update(this.id, formValue).subscribe(
        (response: any) => {
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/menus']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    } else {
      this.menuService.create(formValue).subscribe(
        (response: any) => {
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/menus']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    }
  }
}
