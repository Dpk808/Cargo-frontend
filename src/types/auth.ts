
export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string; 
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser; 
}

export interface RegisterResponse {
  message: string;
  user: Omit<AuthUser, 'role'>;
}
