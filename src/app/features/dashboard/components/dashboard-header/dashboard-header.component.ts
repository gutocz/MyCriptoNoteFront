import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { LanguageSelectorComponent } from '../../../../shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [RouterLink, TranslateModule, LanguageSelectorComponent],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent {
  private auth = inject(AuthService);
  email = this.auth.getEmail();

  logout(): void {
    this.auth.logout();
  }
}
