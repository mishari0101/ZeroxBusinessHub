import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'https://localhost:7021/api/public'; 
  private customerApiUrl = 'https://localhost:7021/api/customer'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Helper for JSON Headers (GET Requests)
  private getHeaders() {
    const token = this.authService.getToken(); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // 1. GET HOME PAGE SHOPS (With Optional District Filter)
  getAllBusinesses(district?: string): Observable<any> {
    let url = `${this.baseUrl}/businesses`;
    if (district) {
      url += `?district=${district}`;
    }
    return this.http.get(url, this.getHeaders());
  }

  // 2. GET SHOP DETAILS (For Details Page)
  getBusinessDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/business/${id}`, this.getHeaders());
  }

  // 3. CREATE BOOKING
  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.customerApiUrl}/book`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`,
        'Content-Type': 'application/json'
      })
    });
  }

  // 4. GET MY BOOKINGS (For Dashboard)
  getMyBookings(): Observable<any> {
    return this.http.get(`${this.customerApiUrl}/my-bookings`, this.getHeaders());
  }

  // 5. GET PROFILE DETAILS
  // Renamed to getProfile to match dashboard.ts usage
  getProfile(): Observable<any> {
    return this.http.get(`${this.customerApiUrl}/profile`, this.getHeaders());
  }

  // 6. UPDATE PROFILE (With Image Support)
  // 🔥 FIX: Using FormData means we DO NOT set Content-Type manually.
  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.customerApiUrl}/update-profile`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
        // Browser sets Content-Type to multipart/form-data automatically
      })
    });
  }
}