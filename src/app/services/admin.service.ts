import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://localhost:7021/api/admin'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
  }

  getStats(): Observable<any> { return this.http.get(`${this.baseUrl}/stats`, this.getHeaders()); }
  
  getPendingBusinesses(): Observable<any> { return this.http.get(`${this.baseUrl}/pending-businesses`, this.getHeaders()); }
  
  updateBusinessStatus(id: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/business/${id}/${status}`, {}, this.getHeaders());
  }

  getAllUsers(): Observable<any> { return this.http.get(`${this.baseUrl}/users`, this.getHeaders()); }
  
  deleteUser(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/user/${id}`, this.getHeaders()); }
}