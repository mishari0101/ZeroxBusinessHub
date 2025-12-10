import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from '../../../services/business.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-services.html',
  styleUrls: ['./manage-services.scss']
})
export class ManageServicesComponent implements OnInit {

  // UI State
  activeTab: string = 'analytics';
  isSidebarOpen: boolean = false; 
  isLoading: boolean = false;
  isEditingProfile: boolean = false;

  // 🔥 WALLET MODAL STATE
  showWalletModal: boolean = false;
  topUpAmount: number = 0;

  // Real-Time Stats
  stats = { 
    earnings: 0, 
    bookings: 0, 
    pending: 0,
    walletBalance: 0 
  };

  services: any[] = [];
  notifications: any[] = []; 
  profile: any = {};

  // Add/Edit Service Model
  isEditMode: boolean = false;
  newService: any = { id: 0, serviceName: '', description: '', price: 0, durationMinutes: 30 };
  selectedFile: File | null = null;
  selectedImagePreview: string | null = null;

  // Profile Image Model
  selectedProfileFile: File | null = null;
  selectedProfilePreview: string | null = null;

  constructor(
    private businessService: BusinessService,
    private authService: AuthService, 
    private router: Router 
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  // --- LOGOUT ---
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- NAVIGATION ---
  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }

  switchTab(tab: string) {
    this.activeTab = tab;
    if(window.innerWidth < 768) this.isSidebarOpen = false;
  }

  // --- LOAD DATA ---
  loadDashboardData() {
    this.isLoading = true;
    
    // 1. Get Profile & Earnings
    this.businessService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.selectedProfilePreview = data.businessImage || 'assets/img/placeholder-profile.jpg';
        this.services = (data.services || []).map((s: any) => ({
          ...s,
          imageUrl: s.imageUrl || s.serviceImage || 'assets/img/placeholder.jpg'
        }));

        // 🔥 MAP WALLET DATA
        this.stats.earnings = data.totalEarnings || 0; // Net Cash Collected
        this.stats.walletBalance = data.walletBalance || 0; // Commission Wallet

        this.isLoading = false;
      },
      error: (err) => { console.error(err); this.isLoading = false; }
    });

    // 2. Get Requests
    this.businessService.getBookingRequests().subscribe({
      next: (requests: any) => {
        this.notifications = requests;
        this.stats.pending = requests.length;
      }
    });
  }

  // --- 🔥 WALLET ACTIONS ---
  openWalletModal() {
    console.log("Opening Wallet Modal...");
    this.showWalletModal = true;
    this.topUpAmount = 0;
  }

  closeWalletModal() {
    this.showWalletModal = false;
  }

  confirmTopUp() {
    if (this.topUpAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    this.businessService.topUpWallet(this.topUpAmount).subscribe({
      next: () => {
        alert(`Successfully added $${this.topUpAmount} to wallet!`);
        this.closeWalletModal();
        this.loadDashboardData(); // Refresh stats to update balance
      },
      error: () => alert("Top-up failed.")
    });
  }

  // --- PROFILE ACTIONS ---
  toggleProfileEdit() { this.isEditingProfile = !this.isEditingProfile; }

  onProfilePicSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.selectedProfilePreview = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('BusinessName', this.profile.businessName);
    formData.append('Address', this.profile.address);
    formData.append('District', this.profile.district);
    formData.append('Phone', this.profile.phone || '');
    formData.append('Category', this.profile.category); 

    if (this.selectedProfileFile) {
      formData.append('image', this.selectedProfileFile);
    }

    this.businessService.updateProfile(formData).subscribe({
      next: () => {
        alert('Profile Updated Successfully!');
        this.isEditingProfile = false;
        this.loadDashboardData(); 
      },
      error: () => { this.isLoading = false; alert('Failed to update profile.'); }
    });
  }

  cancelProfileEdit() {
    this.isEditingProfile = false;
    this.loadDashboardData(); 
  }

  // --- 🔥 UPDATED BOOKING ACTIONS (80/20 Logic) ---
  acceptBooking(booking: any) {
    // 1. Calculate the Split
    const fullPrice = booking.price;            // e.g., $800
    const commission = fullPrice * 0.20;        // e.g., $160 (20%)
    const netEarnings = fullPrice - commission; // e.g., $640 (Net Cash)

    // 2. Check Wallet Balance
    if (this.stats.walletBalance < commission) {
      alert(`⚠️ Insufficient Commission Wallet Balance! 
      
      To accept this job (Price: $${fullPrice}), a platform fee of $${commission} is required.
      Your current wallet balance is only $${this.stats.walletBalance}.
      
      Please Top-Up your wallet to proceed.`);
      this.openWalletModal();
      return;
    }

    // 3. Confirm Dialog
    if (!confirm(`Accept this job for $${fullPrice}?
    
    --------------------------------
    💰 Platform Commission (20%): -$${commission} (Deducted from Wallet)
    💵 Your Net Earning: +$${netEarnings} (Added to Dashboard)
    --------------------------------
    
    Click OK to Accept.`)) {
      return;
    }

    // 4. Send to Backend (Backend does the money subtraction)
    this.businessService.updateBookingStatus(booking.id, 'Accepted').subscribe({
      next: () => {
        alert(`Booking Accepted! Commission of $${commission} has been deducted.`);
        this.loadDashboardData(); // Reloads stats to show updated Net Earnings & Wallet
      },
      error: (err) => alert(err.error?.Message || "Failed to accept booking.")
    });
  }

  declineBooking(id: number) {
    if(confirm('Decline this request?')) {
      this.businessService.updateBookingStatus(id, 'Declined').subscribe({
        next: () => this.loadDashboardData(),
        error: () => alert("Failed to decline.")
      });
    }
  }

  // --- SERVICE MANAGEMENT ---
  initAddService() {
    this.isEditMode = false;
    this.newService = { id: 0, serviceName: '', description: '', price: 0, durationMinutes: 30 };
    this.selectedFile = null;
    this.selectedImagePreview = null;
    this.switchTab('add');
  }

  initEditService(service: any) {
    this.isEditMode = true;
    this.newService = { ...service }; 
    this.selectedImagePreview = service.imageUrl;
    this.switchTab('add'); 
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.selectedImagePreview = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  saveService() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('ServiceName', this.newService.serviceName);
    formData.append('Description', this.newService.description || '');
    formData.append('Price', this.newService.price.toString());
    formData.append('DurationMinutes', this.newService.durationMinutes.toString());

    if (this.selectedFile) formData.append('image', this.selectedFile);

    if (this.isEditMode) {
      this.businessService.updateService(this.newService.id, formData).subscribe({
        next: () => {
          alert('Service Updated!');
          this.loadDashboardData();
          this.switchTab('services');
        },
        error: () => { this.isLoading = false; alert('Failed to update service.'); }
      });
    } else {
      this.businessService.addService(formData).subscribe({
        next: () => {
          alert('Service Added!');
          this.loadDashboardData();
          this.switchTab('services');
        },
        error: () => { this.isLoading = false; alert('Failed to add service.'); }
      });
    }
  }

  deleteService(id: number) {
    if(confirm('Delete this service permanently?')) {
      this.businessService.deleteService(id).subscribe({
        next: () => this.loadDashboardData() 
      });
    }
  }
}