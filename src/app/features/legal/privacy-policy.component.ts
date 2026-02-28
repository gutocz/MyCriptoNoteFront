import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="legal-page">
      <div class="legal-card brutal-card">
        <a routerLink="/" class="back-link">{{ 'common.back' | translate }}</a>
        <h1>{{ 'legal.privacy.title' | translate }}</h1>
        <p class="updated">{{ 'legal.privacy.lastUpdated' | translate }}</p>

        <section>
          <h2>{{ 'legal.privacy.dataCollected.title' | translate }}</h2>
          <ul>
            <li>{{ 'legal.privacy.dataCollected.email' | translate }}</li>
            <li>{{ 'legal.privacy.dataCollected.passwordHash' | translate }}</li>
            <li>{{ 'legal.privacy.dataCollected.encryptedNotes' | translate }}</li>
            <li>{{ 'legal.privacy.dataCollected.noteTitles' | translate }}</li>
            <li>{{ 'legal.privacy.dataCollected.metadata' | translate }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ 'legal.privacy.purpose.title' | translate }}</h2>
          <p>{{ 'legal.privacy.purpose.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.privacy.legalBasis.title' | translate }}</h2>
          <p>{{ 'legal.privacy.legalBasis.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.privacy.zeroKnowledge.title' | translate }}</h2>
          <p>{{ 'legal.privacy.zeroKnowledge.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.privacy.rights.title' | translate }}</h2>
          <ul>
            <li>{{ 'legal.privacy.rights.access' | translate }}</li>
            <li>{{ 'legal.privacy.rights.export' | translate }}</li>
            <li>{{ 'legal.privacy.rights.delete' | translate }}</li>
          </ul>
        </section>

        <section>
          <h2>{{ 'legal.privacy.retention.title' | translate }}</h2>
          <p>{{ 'legal.privacy.retention.text' | translate }}</p>
        </section>

        <section>
          <h2>{{ 'legal.privacy.contact.title' | translate }}</h2>
          <p>{{ 'legal.privacy.contact.text' | translate }}</p>
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
export class PrivacyPolicyComponent {}
