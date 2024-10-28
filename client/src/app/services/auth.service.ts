import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface AuthResponse {
  token: string;
  email: string;
  userId: string;
  username?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private userName = '';
  private userId: string = '';
  private apiUrl = `${environment.apiUrl}/users`;
  private authStatusListener = new BehaviorSubject<boolean>(this.checkAuthStatus());

  constructor(private router: Router, private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): boolean {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    this.isAuthenticated = !!(token && userId);
    return this.isAuthenticated;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response?.token && response?.userId) {
          this.isAuthenticated = true;
          this.userName = email;
          this.userId = response.userId;
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.authStatusListener.next(true);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        this.authStatusListener.next(false);
        return throwError(() => error);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      tap(response => {
        if (response?.token && response?.userId) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
        }
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userName = '';
    this.userId = '';
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.authStatusListener.next(false);
    this.router.navigate(['/homepage']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserName(): string {
    return this.userName;
  }

  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }
}
