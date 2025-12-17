import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';

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

  // Districts List
  districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadBookings();
  }

  // 1. Load Real Profile Data
  loadProfile() {
    this.customerService.getProfile().subscribe({
      next: (data: any) => {
        this.userProfile = data;
        this.previewImage = data.profileImage || null;
      },
      error: (err) => console.error(err)
    });
  }

  // 2. Load Bookings
  loadBookings() {
    this.isLoading = true;
    this.customerService.getMyBookings().subscribe({
      next: (data: any) => {
        this.bookings = data.map((b: any) => ({
          ...b,
          // Handle various image property names
          serviceImage: b.serviceImage || b.imageUrl || b.img || 'https://placehold.co/100x100?text=Service'
        }));
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // 3. Chat Navigation
  goToChat(bookingId: number) {
    this.router.navigate(['/chat', bookingId]);
  }

  // --- Profile Logic ---
  toggleEdit() { this.isEditing = !this.isEditing; }

  // 🔥 FIXED: Renamed to match HTML 'onFileSelected'
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e: any) => { this.previewImage = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('FullName', this.userProfile.fullName);
    formData.append('PhoneNumber', this.userProfile.phoneNumber || ''); // Handle nulls
    formData.append('District', this.userProfile.district || '');
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.customerService.updateProfile(formData).subscribe({
      next: (res: any) => {
        alert('Profile Updated Successfully!');
        this.isEditing = false;
        if(res.profileImage) this.userProfile.profileImage = res.profileImage;
        this.loadProfile(); // Reload data
      },
      error: () => alert('Failed to update profile.')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}