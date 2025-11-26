import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  model: any = {
    role: 'Customer'
  };
  
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    console.log('Button Clicked!'); // <-- ITHA ADD PANNUNGA
    console.log('Form Data:', this.model); // <-- ITHA ADD PANNUNGA
    this.errorMessage = '';
    

    
    this.authService.register(this.model).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        const identifier = this.model.email || this.model.phoneNumber;
        // Verify page ku 'identifier' ah query parameter ah anuppurom
        this.router.navigate(['/verify'], { queryParams: { identifier: identifier } });
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = err.error?.Message || 'An unknown error occurred. Please try again.';
      }
    });
  }
}