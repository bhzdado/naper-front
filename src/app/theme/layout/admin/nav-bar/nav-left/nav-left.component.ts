// Angular import
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-left',
  standalone: false,
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  // public props
  @Output() NavCollapsedMob = new EventEmitter();
}
