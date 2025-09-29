import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-grid-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './grid-menu.component.html',
  styleUrl: './grid-menu.component.scss'
})
export class GridMenuComponent {
  constructor(private loadingService: LoaderService) {
    this.loadingService.setLoading(false);

  }
}
