import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  value = input<string>('');
  valueChange = output<string>();

  onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.valueChange.emit(v);
  }
}
