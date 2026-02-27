import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'mcn_lang';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['pt-BR', 'en-US']);
    const saved = localStorage.getItem(LANG_KEY);
    const lang = saved && this.translate.getLangs().includes(saved) ? saved : 'pt-BR';
    this.translate.use(lang);
  }
}
