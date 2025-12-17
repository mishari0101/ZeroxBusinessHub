import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Update port if different
  private baseUrl = 'https://localhost:7021/api/chat'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken(); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // 1. Get Messages
  getMessages(bookingId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${bookingId}`, this.getHeaders());
  }

  // 2. Send Message
  sendMessage(bookingId: number, messageText: string): Observable<any> {
    const payload = { bookingId, messageText };
    return this.http.post(`${this.baseUrl}/send`, payload, this.getHeaders());
  }
}