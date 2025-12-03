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
    category: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;

  // New Variables for Image
  selectedFile: File | null = null;
  selectedImagePreview: string | null = null;

  categories = [
    'Salon & Spa',
    'Mechanic & Auto Repair',
    'Medical Clinic',
    'Gym & Fitness',
    'Home Cleaning',
    'Tutor / Education',
    'Plumber / Electrician',
    'Event Planner'
  ];

  constructor(private businessService: BusinessService, private router: Router) {}

  // 1. Handle File Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Show Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // 2. Submit Form
  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    // Pass 'selectedFile' to the service (FormData handled in service)
    this.businessService.registerBusiness(this.model, this.selectedFile).subscribe({
      next: (res) => {
        console.log('Business Created:', res);
        this.isLoading = false;
        alert('Business Profile Created Successfully!');
        this.router.navigate(['/business/manage-services']); 
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.Message || 'Failed to create business profile.';
      }
    });
  }
}