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
    role: 'Customer',
    district: '',
    fullName: '',
    email: '', 
    password: '',
    confirmPassword: ''
  };
  
  errorMessage: string = '';
  
  // 🔥 NEW: Loading State
  isLoading: boolean = false; 

  districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.errorMessage = '';

    // 1. Validation Checks
    if (!this.model.fullName || !this.model.email || !this.model.password || !this.model.confirmPassword) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    const input = this.model.email.trim();
    const isEmail = input.includes('@');

    if (isEmail) {
      // Strict Email Validation
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(input)) {
        this.errorMessage = "Invalid Email Format. Example: user@gmail.com";
        return; 
      }
    } else {
      const phonePattern = /^[0-9]{9,15}$/;
      if (!phonePattern.test(input)) {
        this.errorMessage = "Invalid Phone Number. Use digits only.";
        return; 
      }
    }

    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    // 2. Start Loading (Validation Passed)
    this.isLoading = true; 

    // 3. Send to Backend
    this.authService.register(this.model).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        const identifier = this.model.email || this.model.phoneNumber;
        this.isLoading = false; // Stop loading
        this.router.navigate(['/verify'], { queryParams: { identifier: input } });
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.isLoading = false; // Stop loading on error
        this.errorMessage = err.error?.Message || err.error?.message || 'Registration failed. Check your connection.';
      }
    });
  }
}