// src/app/pages/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink for HTML links
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink // Required for [routerLink] to work in HTML
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  // Model to store form data
  model: any = {};
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // 1. Standard Email/Password Login
  onSubmit(): void {
    this.errorMessage = '';
    console.log('Attempting login with:', this.model);

    this.authService.login(this.model).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        
        // TODO: Save the Token here (e.g., localStorage.setItem('token', response.token))
        
        // Redirect based on role (Placeholder logic)
        if (response.role === 'Admin') {
          // this.router.navigate(['/admin']);
        } else if (response.role === 'BusinessOwner') {
          // this.router.navigate(['/business']);
        } else {
          // Default redirect for Customers
           this.router.navigate(['/']); 
        }
        
        // For now, just show an alert so you know it worked
        alert('Login Successful! Welcome back.');
      },
      error: (err) => {
        console.error('Login failed', err);
        // Display error from backend or generic message
        this.errorMessage = err.error?.Message || 'Login failed. Please check your credentials.';
      }
    });
  }

  // 2. Social Login Handlers (Placeholders for now)
  loginWithGoogle() {
    console.log('Google Login Clicked');
    alert('Google Login integration is coming soon!');
  }

  loginWithApple() {
    console.log('Apple Login Clicked');
    alert('Apple Login integration is coming soon!');
  }

  loginWithFacebook() {
    console.log('Facebook Login Clicked');
    alert('Facebook Login integration is coming soon!');
  }
}