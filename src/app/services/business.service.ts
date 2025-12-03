import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  // Check your port
  private baseUrl = 'https://localhost:7021/api/business'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken(); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Update registerBusiness method:

registerBusiness(data: any, file: File | null): Observable<any> {
  const formData = new FormData();
  
  formData.append('BusinessName', data.businessName);
  formData.append('Category', data.category);
  formData.append('Description', data.description || '');
  formData.append('Address', data.address);
  formData.append('Phone', data.phone);
  formData.append('WorkingHours', data.workingHours || '');

  // Append Image if selected
  if (file) {
    formData.append('image', file);
  }

  const token = this.authService.getToken();
  const headers = { 'Authorization': `Bearer ${token}` };

  return this.http.post(`${this.baseUrl}/register`, formData, { headers });
}

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-profile`, this.getHeaders());
  }

  addService(data: any, file: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('ServiceName', data.serviceName);
    formData.append('Description', data.description || '');
    formData.append('Price', data.price.toString());
    formData.append('DurationMinutes', data.durationMinutes.toString());

    if (file) { formData.append('image', file); }

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    return this.http.post(`${this.baseUrl}/add-service`, formData, { headers });
  }

  // 🔥 UPDATED: Update Service
  updateService(id: number, data: any, file: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('ServiceName', data.serviceName);
    formData.append('Description', data.description || '');
    formData.append('Price', data.price.toString());
    formData.append('DurationMinutes', data.durationMinutes.toString());

    if (file) { formData.append('image', file); }

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    return this.http.put(`${this.baseUrl}/service/${id}`, formData, { headers });
  }

  // 🔥 UPDATED: Delete Service
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/service/${id}`, this.getHeaders());
  }
}