import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  // Check your port (7021 or 7000)
  private baseUrl = 'https://localhost:7021/api/public';

  constructor(private http: HttpClient) { }

  // Get All Businesses
  getAllBusinesses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/businesses`);
  }

  // Get Single Business
  getBusinessById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/business/${id}`);
  }
}