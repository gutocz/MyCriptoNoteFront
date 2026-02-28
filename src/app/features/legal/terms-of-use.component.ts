import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="legal-page">
      <div class="legal-card brutal-card">
        <a routerLink="/" class="back-link">{{ 'common.back' | translate }}</a>
        <h1>{{ 'legal.terms.title' | translate }}</h1>
        <p class="updated">{{ 'legal.terms.lastUpdated' | translate }}</p>

        <section>
          <h2>{{ 'legal.terms.acceptance.title' | translate }}</h2>
          <p>{{ 'legal.terms.acceptance.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.terms.service.title' | translate }}</h2>
          <p>{{ 'legal.terms.service.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.terms.account.title' | translate }}</h2>
          <p>{{ 'legal.terms.account.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.terms.encryption.title' | translate }}</h2>
          <p>{{ 'legal.terms.encryption.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.terms.responsibilities.title' | translate }}</h2>
          <ul>
            <li>{{ 'legal.terms.responsibilities.passwords' | translate }}</li>
            <li>{{ 'legal.terms.responsibilities.content' | translate }}</li>
            <li>{{ 'legal.terms.responsibilities.security' | translate }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ 'legal.terms.termination.title' | translate }}</h2>
          <p>{{ 'legal.terms.termination.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.terms.liability.title' | translate }}</h2>
          <p>{{ 'legal.terms.liability.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.terms.contact.title' | translate }}</h2>
          <p>{{ 'legal.terms.contact.text' | translate }}</p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;
    
    .legal-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 2rem 1.5rem;
    }
    .legal-card {
      width: 100%;
      max-width: 720px;
    }
    .back-link {
      font-weight: 600;
      color: #A78BFA;
      display: inline-block;
      margin-bottom: 1rem;
    }
    h1 { margin-bottom: 0.25rem; }
    .updated {
      font-size: 0.8125rem;
      color: #888;
      margin-bottom: 2rem;
    }
    section { margin-bottom: 1.5rem; }
    h2 { margin-bottom: 0.5rem; font-size: 1.125rem; }
    ul { padding-left: 1.25rem; }
    li { line-height: 1.7; }
    p { line-height: 1.7; }
  `]
})
export class TermsOfUseComponent {}
