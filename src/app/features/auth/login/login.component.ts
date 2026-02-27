import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  submit(): void {
    this.error = '';
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/notes']),
      error: () => {
        this.loading = false;
        this.error = 'errors.invalidCredentials';
      },
      complete: () => { this.loading = false; }
    });
  }
}
