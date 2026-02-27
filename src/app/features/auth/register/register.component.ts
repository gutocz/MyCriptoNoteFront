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
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', Validators.required]
  });

  loading = false;
  error = '';

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
