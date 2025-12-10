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
        console.log('Login successful!', response);
        this.authService.saveToken(response.token);
        
        if (response.role === 'Admin') {
           // 🔥 FIXED: Redirect to Dashboard, not Approvals
           this.router.navigate(['/admin/dashboard']);
        } 
        else if (response.role === 'BusinessOwner') {
           this.checkBusinessProfileAndRedirect();
        } 
        else {
           this.router.navigate(['/']); 
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = err.error?.Message || 'Login failed. Please check your credentials.';
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