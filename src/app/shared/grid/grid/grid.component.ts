import { AfterContentInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GuiGridModule, GuiLocalization, GuiColumn, GuiPaging, GuiPagingDisplay, GuiSorting, GuiInfoPanel, GuiCellEdit, GuiSearching, GuiColumnMenu, GuiRowSelection, GuiRowSelectionType, GuiRowSelectionMode, GuiSortingOrder, GuiSummaries, GuiRowClass } from '@generic-ui/ngx-grid';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Actions } from 'src/app/interfaces/actions';
import { GridLocalization } from '../grid-localization';


@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [GuiGridModule, CommonModule, MatMenuModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit, AfterContentInit {
  @Input() source: Array<any>;
  @Input() actions: Array<Actions>;
  @Input() columns: Array<GuiColumn>;
  @Input() paging: GuiPaging;
  @Input() loading: boolean = true;
  @Input() cellEditing: boolean = false;
  @Input() columnMatcher: any;
  @Input() actionMenu: boolean = false;


  @Input() gridAfterEditCell: (args: any) => void;
  @Input() getValueCell: (index: number, value: any, field: any) => string;

  getValue(index: number, value: any, item: any, field: any) {
    if (this.getValueCell) {
      return this.getValueCell(index, item, field) ?? value;
    }

    return value;
  }

  searching: GuiSearching = {
    enabled: true,
    placeholder: 'Procurar...',
    highlighting: false
  };

  infoPanel: GuiInfoPanel = {
    enabled: true,
    infoDialog: false,
    columnsManager: true,
    schemaManager: false
  };

  columnSorting = {
    enabled: true,
    order: GuiSortingOrder.ASC
  };

  cellEditingEnabled = {
    enabled: true
  };

  cellEditingDisabled = {
    enabled: false
  };

  summaries: GuiSummaries = {
    enabled: true
  };

  budgetSummaries = {
    enabled: true,
    summariesTypes: [
      'sum'
    ]
  };

  trainingSummaries = {
    enabled: true,
    summariesTypes: [
      'average'
    ]
  };

  sorting: GuiSorting = {
    enabled: true,
    multiSorting: true
  };

  columnMenu: GuiColumnMenu = {
    enabled: true,
    columnsManager: true
  };

  rowSelection: boolean | GuiRowSelection = {
    enabled: true,
    type: GuiRowSelectionType.CHECKBOX,
    mode: GuiRowSelectionMode.MULTIPLE
  };

  rowClass: GuiRowClass = {
    class: 'row-highlighted'
  };

  localization: GuiLocalization = {};

  constructor(private readonly cd: ChangeDetectorRef, private guiLocalization: GridLocalization) {
    this.localization = this.guiLocalization.getConfig();
  }

  ngOnInit() {
    this.actions.forEach((currentValue, index) => {
      if (typeof currentValue.disabled !== "function") {
        this.actions[index].disabled = function() {
          return false;
        }
      }

      if (typeof currentValue.hidden !== "function") {
        this.actions[index].hidden = function() {
          return false;
        }
      }
    });

    this.paging = {
      enabled: true,
      page: 1,
      pageSize: 10,
      pageSizes: [2, 10, 25, 50],
      pagerTop: false,
      pagerBottom: true,
      display: GuiPagingDisplay.BASIC
    };
  }

  acao(action: Function, item: any) {
    action(item);
  }

  apagar(id: number): void {
    alert('Remove item: ' + id);
    //this.userRepository.remove(id);
  }

  showDetails(item: any): void {
    alert(item.name)
  }

  afterEditCell($event) {
    this.gridAfterEditCell($event);
  }

  ngAfterContentInit(): void {

  }
}