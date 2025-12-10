import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class CustomerDashboardComponent implements OnInit {

  bookings: any[] = [];
  
  userProfile: any = { 
    fullName: '', 
    phoneNumber: '', 
    district: '', 
    profileImage: '' 
  };
  
  isEditing = false;
  isLoading = true;
  
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadProfile();
    this.loadBookings();
  }

  // 1. Load Real Profile Data
  loadProfile() {
    this.customerService.getProfile().subscribe({
      next: (data: any) => {
        this.userProfile = data;
        this.previewImage = data.profileImage || null; // Set initial image
      },
      error: (err) => console.error(err)
    });
  }

  // 2. Load Bookings
  loadBookings() {
    this.isLoading = true;
    this.customerService.getMyBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  toggleEdit() { this.isEditing = !this.isEditing; }

  // 3. Handle Image Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.previewImage = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  // 4. Save Changes to Database
  saveProfile() {
    const formData = new FormData();
    formData.append('FullName', this.userProfile.fullName);
    formData.append('PhoneNumber', this.userProfile.phoneNumber);
    formData.append('District', this.userProfile.district);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.customerService.updateProfile(formData).subscribe({
      next: (res: any) => {
        alert('Profile Updated Successfully!');
        this.isEditing = false;
        // Update local image with new URL from backend
        if(res.profileImage) this.userProfile.profileImage = res.profileImage;
      },
      error: () => alert('Failed to update profile.')
    });
  }
}