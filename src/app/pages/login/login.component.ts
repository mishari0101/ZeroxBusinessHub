import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
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

  constructor(
    private authService: AuthService, 
    private businessService: BusinessService, 
    private router: Router
  ) { }

  onSubmit(): void {
  this.errorMessage = '';
  
  this.authService.login(this.model).subscribe({
    next: (response) => {
      this.authService.saveToken(response.token);
      
      // 🔥 NEW REDIRECT LOGIC
      if (response.role === 'BusinessOwner') {
        
        if (response.status === 'None') {
          // 1. New User -> Go to Profile Setup
          this.router.navigate(['/business/profile-setup']);
        } 
        else if (response.status === 'Pending') {
          // 2. Profile Submitted but not Approved -> Go to Pending Page
          this.router.navigate(['/business/pending']);
        } 
        else if (response.status === 'Active') {
          // 3. Approved -> Go to Dashboard
          this.router.navigate(['/business/manage-services']);
        } 
        else {
          alert("Your account has been suspended or rejected.");
        }

      } else if (response.role === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/']); 
      }
    },
    error: (err) => {
      this.errorMessage = err.error?.Message || 'Login failed.';
    }
  });
}

  checkBusinessProfileAndRedirect() {
    this.businessService.getMyProfile().subscribe({
      next: (data) => {
        console.log('Business Profile found:', data);
        this.router.navigate(['/business/manage-services']);
      },
      error: (err) => {
        console.log('No Business Profile found, redirecting to setup.');
        this.router.navigate(['/business/profile-setup']);
      }
    });
  }

  loginWithGoogle() { alert('Google Login integration is coming soon!'); }
  loginWithApple() { alert('Apple Login integration is coming soon!'); }
  loginWithFacebook() { alert('Facebook Login integration is coming soon!'); }
}