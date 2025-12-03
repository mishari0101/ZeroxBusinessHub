import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
// 1. IMPORT BUSINESS SERVICE
import { BusinessService } from '../../services/business.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  model: any = {};
  errorMessage: string = '';

  // 2. INJECT BUSINESS SERVICE IN CONSTRUCTOR
  constructor(
    private authService: AuthService, 
    private businessService: BusinessService, 
    private router: Router
  ) { }

  // 1. Standard Email/Password Login
  onSubmit(): void {
    this.errorMessage = '';
    
    this.authService.login(this.model).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        
        // 1. SAVE THE TOKEN (Crucial Step)
        this.authService.saveToken(response.token);
        
        // 2. REDIRECT BASED ON ROLE
        if (response.role === 'Admin') {
           this.router.navigate(['/admin/approvals']);
        } 
        else if (response.role === 'BusinessOwner') {
           // Instead of going directly to setup, check if profile exists
           this.checkBusinessProfileAndRedirect();
        } 
        else {
           // Default: Customer Home
           this.router.navigate(['/']); 
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = err.error?.Message || 'Login failed. Please check your credentials.';
      }
    });
  }

  // 3. NEW HELPER METHOD TO CHECK PROFILE
  checkBusinessProfileAndRedirect() {
    this.businessService.getMyProfile().subscribe({
      next: (data) => {
        // SUCCESS: Profile Irukku -> Go to Manage Services (Dashboard)
        console.log('Business Profile found:', data);
        this.router.navigate(['/business/manage-services']);
      },
      error: (err) => {
        // ERROR (404): Profile Illa -> Go to Setup Page
        console.log('No Business Profile found, redirecting to setup.');
        this.router.navigate(['/business/profile-setup']);
      }
    });
  }

  // 2. Social Login Handlers
  loginWithGoogle() {
    alert('Google Login integration is coming soon!');
  }

  loginWithApple() {
    alert('Apple Login integration is coming soon!');
  }

  loginWithFacebook() {
    alert('Facebook Login integration is coming soon!');
  }
}