import { Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterLink, TranslateModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  private auth = inject(AuthService);
  private translate = inject(TranslateService);
  private toast = inject(ToastrService);
  private ngZone = inject(NgZone);

  email = this.auth.getEmail();
  loading = false;
  error = '';
  accountReady = false;
  googleLinked = false;
  linkPassword = '';
  hasPassword = false;
  newPassword = '';
  showPassword = false;

  @ViewChild('googleButton', { static: false })
  private googleButton?: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.auth.getMe().subscribe({
      next: (me) => {
        this.googleLinked = me.authProvider === 'google';
        this.hasPassword = me.hasPassword;
        this.accountReady = true;
        if (!this.googleLinked || !this.hasPassword) {
          setTimeout(() => this.initGoogle(), 0);
        }
      },
      error: () => {
        this.accountReady = true;
        setTimeout(() => this.initGoogle(), 0);
      }
    });
  }

  private initGoogle(): void {
    if (this.googleLinked && this.hasPassword) return;
    const clientId = environment.googleClientId;
    const maxAttempts = 20;
    let attempts = 0;

    const tryInit = () => {
      attempts += 1;
      const host = this.googleButton?.nativeElement;
      if (!clientId || typeof google === 'undefined' || !google.accounts?.id) {
        if (attempts < maxAttempts) setTimeout(tryInit, 200);
        return;
      }
      if (!host) {
        if (attempts < maxAttempts) setTimeout(tryInit, 200);
        return;
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          const credential = response?.credential;
          if (!credential) return;
          this.ngZone.run(() => {
            if (this.loading) return;
            if (this.googleLinked) {
              if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(this.newPassword)) {
                this.error = 'errors.passwordPolicy';
                return;
              }
              this.loading = true;
              this.error = '';
              this.auth.setGooglePassword(credential, this.newPassword).subscribe({
                next: () => { this.hasPassword = true; this.loading = false; this.newPassword = ''; this.toast.success(this.translate.instant('toasts.passwordAdded')); },
                error: (err) => { this.loading = false; this.error = err.error?.error || 'errors.googleLoginFailed'; }
              });
              return;
            }
            const password = this.linkPassword;
            if (!password.trim()) {
              this.error = 'errors.googleLinkPasswordRequired';
              return;
            }
            this.loading = true;
            this.error = '';
            this.auth.googleLink({ credential, password }).subscribe({
              next: () => {
                this.loading = false;
                this.googleLinked = true;
                this.toast.success(this.translate.instant('toasts.googleLinkedSuccess'));
              },
              error: (err) => {
                this.loading = false;
                this.error = err.error?.error || 'errors.googleLoginFailed';
              },
              complete: () => { this.loading = false; }
            });
          });
        }
      });

      google.accounts.id.renderButton(host, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with'
      });
    };

    tryInit();
  }
}
