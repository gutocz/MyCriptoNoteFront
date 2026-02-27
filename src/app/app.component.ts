import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'mcn_lang';
const CLICK_CURSOR_DURATION_MS = 280;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private translate = inject(TranslateService);
  private clickCursorTimeout: ReturnType<typeof setTimeout> | null = null;

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('a, button, [role="button"], .clickable')) {
      if (this.clickCursorTimeout) clearTimeout(this.clickCursorTimeout);
      document.body.classList.add('cursor-click');
      this.clickCursorTimeout = setTimeout(() => {
        document.body.classList.remove('cursor-click');
        this.clickCursorTimeout = null;
      }, CLICK_CURSOR_DURATION_MS);
    }
  }

  constructor() {
    this.translate.addLangs(['pt-BR', 'en-US']);
    const saved = localStorage.getItem(LANG_KEY);
    const lang = saved && this.translate.getLangs().includes(saved) ? saved : 'pt-BR';
    this.translate.use(lang);
  }
}
