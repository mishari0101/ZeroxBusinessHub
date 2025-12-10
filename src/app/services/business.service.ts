import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  // Using your specific port
  private baseUrl = 'https://localhost:7021/api/business'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  // 1. JSON Headers (For GET requests & Text-Only POST)
  private getJsonHeaders() {
    const token = this.authService.getToken(); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      })
    };
  }

  // 2. FORM DATA Headers (For File Uploads)
  private getFormDataHeaders() {
    const token = this.authService.getToken(); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
        // Browser sets Content-Type automatically for FormData
      })
    };
  }

  // ==========================================
  // 1. PROFILE & REGISTRATION
  // ==========================================
  
  registerBusiness(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data, this.getFormDataHeaders());
  }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-profile`, this.getJsonHeaders());
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-profile`, data, this.getFormDataHeaders());
  }

  // ==========================================
  // 2. SERVICE MANAGEMENT
  // ==========================================

  addService(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-service`, data, this.getFormDataHeaders());
  }

  updateService(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/service/${id}`, data, this.getFormDataHeaders());
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/service/${id}`, this.getJsonHeaders());
  }

  // ==========================================
  // 3. DASHBOARD, BOOKINGS & WALLET
  // ==========================================

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard-stats`, this.getJsonHeaders());
  }

  getBookingRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/requests`, this.getJsonHeaders());
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    // Stringify the status to send it as a valid JSON string
    return this.http.post(`${this.baseUrl}/booking/${id}/status`, JSON.stringify(status), this.getJsonHeaders());
  }

  completeBooking(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/booking/${id}/complete`, {}, this.getJsonHeaders());
  }

  topUpWallet(amount: number): Observable<any> {
    // Stringify the amount for the backend [FromBody] decimal
    return this.http.post(`${this.baseUrl}/wallet/top-up`, JSON.stringify(amount), this.getJsonHeaders());
  }
}