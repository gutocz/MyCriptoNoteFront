import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  message = input<string>('');
  confirmLabel = input<string>('');
  loading = input<boolean>(false);

  confirmed = output<void>();
  cancelled = output<void>();
}
