import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { MatStepperIntl } from '@angular/material/stepper';
import { SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from 'src/app/shared/pipes/SafeHtml.pipe';

@Component({
  selector: 'app-site-spinner',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  providers: [{ provide: MatStepperIntl }],
})
export class SpinnerComponent {
  loading: Observable<boolean>;

  constructor(public loaderService: LoaderService) {

  }

  ngOnInit(): void {
    this.loading = this.loaderService.loadingObs; // Subscribe to loading state
  }
}
