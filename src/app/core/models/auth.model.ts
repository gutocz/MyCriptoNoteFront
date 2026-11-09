export interface AuthResponse {
  token: string;
  email: string;
  authProvider?: string;
}

export interface MeResponse {
  email: string;
  authProvider: string;
  hasPassword: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface GoogleLinkRequest {
  credential: string;
  password: string;
}
