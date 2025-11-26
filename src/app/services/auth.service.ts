// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // IMPORTANT: Unga backend API oda sariyana URL ah inga podunga
  private apiUrl = 'https://localhost:7021/api/Account'; // Please verify this URL and Port

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  verify(verificationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, verificationData);
  }
}