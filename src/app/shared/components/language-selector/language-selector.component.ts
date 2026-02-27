import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'mcn_lang';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  private translate = inject(TranslateService);
  currentLang = this.translate.currentLang || 'pt-BR';
  open = false;

  setLang(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem(LANG_KEY, lang);
    this.open = false;
  }

  toggle(): void {
    this.open = !this.open;
  }
}
