import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { GuiGridModule } from '@generic-ui/ngx-grid';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from 'src/app/angular-material.module';

@Component({
  selector: 'app-all-menus',
  standalone: true,
  imports: [AngularMaterialModule, SharedModule, GuiGridModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './all-menus.component.html',
  styleUrl: './all-menus.component.scss'
})
export default class AllMenusComponent implements OnInit { 
  ngOnInit(): void {

  }
}
