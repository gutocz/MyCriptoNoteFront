import { AfterViewInit, Component, ElementRef, NgZone, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  @ViewChild('googleButton', { static: true })
  private googleButton!: ElementRef<HTMLElement>;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
    ]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue]
  });

  loading = false;
  error = '';

  ngAfterViewInit(): void {
    this.initGoogle();
  }

  get pw(): string {
    return this.form.get('password')?.value ?? '';
  }

  get hasMinLength(): boolean { return this.pw.length >= 8; }
  get hasUppercase(): boolean { return /[A-Z]/.test(this.pw); }
  get hasLowercase(): boolean { return /[a-z]/.test(this.pw); }
  get hasNumber(): boolean { return /\d/.test(this.pw); }
  get hasSpecial(): boolean { return /[^a-zA-Z0-9]/.test(this.pw); }

  submit(): void {
    this.error = '';
    const { confirmPassword, acceptTerms, ...payload } = this.form.getRawValue();
    if (payload.password !== confirmPassword) {
      this.error = 'errors.passwordMismatch';
      return;
    }
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/notes']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'errors.registrationFailed';
      },
      complete: () => { this.loading = false; }
    });
  }

  private initGoogle(): void {
    const clientId = environment.googleClientId;
    const maxAttempts = 20;
    let attempts = 0;

    const tryInit = () => {
      attempts += 1;
      if (!clientId || typeof google === 'undefined' || !google.accounts?.id) {
        if (attempts < maxAttempts) setTimeout(tryInit, 200);
        return;
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          const credential = response?.credential;
          if (!credential) return;
          this.ngZone.run(() => {
            this.loading = true;
            this.error = '';
            this.auth.googleLogin({ credential }).subscribe({
              next: () => this.router.navigate(['/notes']),
              error: (err) => {
                this.loading = false;
                this.error = err.error?.error || 'errors.googleLoginFailed';
              },
              complete: () => { this.loading = false; }
            });
          });
        }
      });

      google.accounts.id.renderButton(this.googleButton.nativeElement, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with'
      });
    };

    tryInit();
  }
}
