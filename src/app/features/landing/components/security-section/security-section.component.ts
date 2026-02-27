import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-security-section',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './security-section.component.html',
  styleUrl: './security-section.component.scss'
})
export class SecuritySectionComponent {}
