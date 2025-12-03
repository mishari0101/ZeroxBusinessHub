import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Make sure this port matches your C# API (e.g., 7000 or 5132)
  private baseUrl = 'https://localhost:7021/api/Account'; 

  constructor(private http: HttpClient) { }

  // --- API CALLS ---

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  verify(verifyData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify`, verifyData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  // --- TOKEN MANAGEMENT (This fixes the error) ---

  // Save the token to browser storage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get the token (This is what BusinessService is looking for)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove token (Logout)
  logout(): void {
    localStorage.removeItem('token');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}