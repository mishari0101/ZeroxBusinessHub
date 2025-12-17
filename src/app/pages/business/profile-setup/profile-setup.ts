import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from '../../../services/business.service';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-setup.html',
  styleUrls: ['./profile-setup.scss']
})
export class ProfileSetupComponent {

  model: any = {
    businessName: '',
    category: '',
    description: '',
    address: '',
    district: '',
    phone: '',
    workingHours: ''
  };

  selectedFile: File | null = null; // Store RAW file here
  selectedImagePreview: string | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // 🔥 MODAL STATE
  showSuccessModal: boolean = false;

  categories = [
    'Salon & Spa', 'Mechanic & Auto Repair', 'Medical Clinic',
    'Gym & Fitness', 'Home Cleaning', 'Tutor / Education',
    'Plumber / Electrician', 'Event Planner'
  ];

  districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  constructor(private businessService: BusinessService, private router: Router) {}

  // Handle Image Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Store raw file for upload

      // Create preview for UI only
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    // Create FormData (Correct way to send File + Data)
    const formData = new FormData();
    formData.append('BusinessName', this.model.businessName);
    formData.append('Category', this.model.category);
    formData.append('Description', this.model.description || '');
    formData.append('Address', this.model.address);
    formData.append('District', this.model.district);
    formData.append('Phone', this.model.phone);
    formData.append('WorkingHours', this.model.workingHours || '');

    // Append Image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Key 'image' matches Backend IFormFile
    }

    this.businessService.registerBusiness(formData).subscribe({
      next: (res) => {
        console.log('Business Created:', res);
        this.isLoading = false;
        
        // 🔥 SHOW MODAL
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.Message || 'Failed to create business profile.';
      }
    });
  }
  
  // 🔥 CLOSE MODAL & REDIRECT
  onCloseModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/business/pending']); // Redirect to Pending Page
  }
}