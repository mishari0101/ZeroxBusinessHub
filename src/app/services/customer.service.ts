import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // Public Endpoints (Search, Details)
  private baseUrl = 'https://localhost:7021/api/public'; 
  
  // Protected Endpoints (Bookings, Profile)
  private customerApiUrl = 'https://localhost:7021/api/customer'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  // 🔥 HELPER: Get JSON Headers (With Token)
  private getHeaders() {
    const token = this.authService.getToken(); 
    console.log("Token being sent:", token); // 🔥 Check this in Console!
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // 🔥 HELPER: Get Form Data Headers (With Token - No Content-Type)
  private getFormDataHeaders() {
    const token = this.authService.getToken(); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ==========================================
  // 1. PUBLIC ENDPOINTS (Home Page)
  // ==========================================

  // Get Home Page Shops
  getAllBusinesses(district?: string): Observable<any> {
    let url = `${this.baseUrl}/businesses`;
    if (district && district !== 'All Island') {
      url += `?district=${district}`;
    }
    // Note: Public endpoints might not need headers, but adding them doesn't hurt logged-in users.
    return this.http.get(url); 
  }

  // Get Shop Details
  getBusinessDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/business/${id}`);
  }

  // ==========================================
  // 2. PROTECTED ENDPOINTS (Requires Login)
  // ==========================================

  // Create Booking
  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.customerApiUrl}/book`, data, this.getHeaders());
  }

  // Get My Bookings (Dashboard)
  getMyBookings(): Observable<any> {
    return this.http.get(`${this.customerApiUrl}/my-bookings`, this.getHeaders());
  }

  // Get Profile Details
  getProfile(): Observable<any> {
    return this.http.get(`${this.customerApiUrl}/profile`, this.getHeaders());
  }

  // Update Profile (With Image)
  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.customerApiUrl}/update-profile`, data, this.getFormDataHeaders());
  }
}