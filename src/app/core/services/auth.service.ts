import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, GoogleLinkRequest, GoogleLoginRequest, LoginRequest, MeResponse, RegisterRequest } from '../models/auth.model';
import { FolderGrantsService } from './folder-grants.service';
import { ToastrService } from 'ngx-toastr';

const TOKEN_KEY = 'mcn_token';
const EMAIL_KEY = 'mcn_email';
const AUTH_PROVIDER_KEY = 'mcn_auth_provider';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private grants: FolderGrantsService,
    private toast: ToastrService
  ) {}

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, req).pipe(
      tap((res) => this.setSession(res))
    );
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, req).pipe(
      tap((res) => this.setSession(res))
    );
  }

  googleLogin(req: GoogleLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/google`, req).pipe(
      tap((res) => this.setSession(res))
    );
  }

  googleLink(req: GoogleLinkRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/google/link`, req).pipe(
      tap((res) => { this.grants.clear(); this.setSession(res); })
    );
  }

  setGooglePassword(credential: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.base}/google/set-password`, { credential, password });
  }

  logout(): void {
    this.http.post<void>(`${this.base}/logout`, {}).subscribe({
      next: () => this.clearSession(),
      error: (err) => {
        if (err.status === 401) this.clearSession();
        else this.toast.error('Não foi possível encerrar a sessão. Verifique sua conexão e tente novamente.');
      }
    });
  }

  clearSession(): void {
    this.grants.clear();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(AUTH_PROVIDER_KEY);
    this.router.navigate(['/']);
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.base}/account`);
  }

  exportMyData(): Observable<unknown> {
    return this.http.get(`${this.base}/my-data`);
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.base}/me`).pipe(
      tap((me) => this.persistAuthProvider(me.authProvider))
    );
  }

  getAuthProvider(): string | null {
    return localStorage.getItem(AUTH_PROVIDER_KEY);
  }

  persistAuthProvider(authProvider: string): void {
    localStorage.setItem(AUTH_PROVIDER_KEY, authProvider);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(EMAIL_KEY);
  }

  getEmail(): string | null {
    return localStorage.getItem(EMAIL_KEY);
  }

  private setSession(res: AuthResponse): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(EMAIL_KEY, res.email);
    const provider = res.authProvider?.trim() || 'local';
    localStorage.setItem(AUTH_PROVIDER_KEY, provider);
  }
}
