import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
    ]],
    confirmPassword: ['', Validators.required]
  });

  loading = false;
  error = '';

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
    const { confirmPassword, ...payload } = this.form.getRawValue();
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
        this.error = err.error?.error || 'errors.emailInUse';
      },
      complete: () => { this.loading = false; }
    });
  }
}
