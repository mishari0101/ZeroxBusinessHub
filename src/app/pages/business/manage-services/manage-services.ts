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

  // 🔥 CUSTOM MODAL STATE
  showSuccessModal: boolean = false;
  showConfirmModal: boolean = false;
  showErrorModal: boolean = false;
  
  modalMessage: string = '';
  confirmTitle: string = '';
  confirmMessage: string = '';
  errorMessage: string = '';
  
  onConfirmAction: () => void = () => {};

  // Wallet Modal
  showWalletModal: boolean = false;
  topUpAmount: number = 0;

  stats = { earnings: 0, bookings: 0, pending: 0, walletBalance: 0 };
  services: any[] = [];
  notifications: any[] = []; 
  profile: any = {};

  isEditMode: boolean = false;
  newService: any = { id: 0, serviceName: '', description: '', price: 0, durationMinutes: 30 };
  selectedFile: File | null = null;
  selectedImagePreview: string | null = null;
  selectedProfileFile: File | null = null;
  selectedProfilePreview: string | null = null;

  constructor(
    private businessService: BusinessService,
    private authService: AuthService, 
    private router: Router 
  ) {}

  ngOnInit() { this.loadDashboardData(); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }

  switchTab(tab: string) {
    this.activeTab = tab;
    if(window.innerWidth < 768) this.isSidebarOpen = false;
  }

  // --- 🔥 UPDATED LOAD DATA LOGIC ---
  loadDashboardData() {
    this.isLoading = true;
    
    // 1. Get Profile (For Image, Services, Wallet, Earnings)
    this.businessService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.selectedProfilePreview = data.businessImage || 'assets/img/placeholder-profile.jpg';
        this.services = (data.services || []).map((s: any) => ({
          ...s, imageUrl: s.imageUrl || s.serviceImage || 'assets/img/placeholder.jpg'
        }));
        
        // Map Wallet & Earnings directly from Profile
        this.stats.earnings = data.totalEarnings || 0;
        this.stats.walletBalance = data.walletBalance || 0;
      },
      error: (err) => { console.error(err); this.isLoading = false; }
    });

    // 2. 🔥 FIX: Get "Jobs Done" Count from Stats API
    this.businessService.getDashboardStats().subscribe({
      next: (data: any) => {
        this.stats.bookings = data.jobsDone || 0; // Fixes "Jobs Done" showing 0
        this.stats.pending = data.pendingCount || 0;
        this.isLoading = false;
      },
      error: (err) => console.error("Stats Error:", err)
    });

    // 3. Get Requests List
    this.businessService.getBookingRequests().subscribe({
      next: (requests: any) => {
        this.notifications = requests;
        // Fallback: If stats API fails, we count pending here
        if(this.stats.pending === 0) this.stats.pending = requests.filter((r: any) => r.status === 'Pending').length;
      }
    });
  }

  // --- CHAT NAVIGATION ---
  goToChat(bookingId: number) {
    this.router.navigate(['/chat', bookingId]);
  }

  // --- MODAL TRIGGERS ---
  triggerSuccess(msg: string) {
    this.modalMessage = msg;
    this.showSuccessModal = true;
  }

  triggerError(msg: string) {
    this.errorMessage = msg;
    this.showErrorModal = true;
  }

  triggerConfirm(title: string, msg: string, action: () => void) {
    this.confirmTitle = title;
    this.confirmMessage = msg;
    this.onConfirmAction = () => {
      action();
      this.closeModals();
    };
    this.showConfirmModal = true;
  }

  closeModals() {
    this.showSuccessModal = false;
    this.showConfirmModal = false;
    this.showErrorModal = false;
  }

  // --- WALLET ---
  openWalletModal() { this.showWalletModal = true; this.topUpAmount = 0; }
  closeWalletModal() { this.showWalletModal = false; }

  confirmTopUp() {
    if (this.topUpAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    this.businessService.topUpWallet(this.topUpAmount).subscribe({
      next: () => {
        this.closeWalletModal();
        this.loadDashboardData(); 
        this.triggerSuccess(`Successfully added $${this.topUpAmount} to wallet!`);
      },
      error: () => alert("Top-up failed.")
    });
  }

  // --- PROFILE ---
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
    if (this.selectedProfileFile) formData.append('image', this.selectedProfileFile);

    this.businessService.updateProfile(formData).subscribe({
      next: () => {
        this.triggerSuccess('Profile Updated Successfully!');
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

  // --- BOOKING LOGIC ---
  
  initAcceptBooking(booking: any) {
    const fullPrice = booking.price;
    const commission = fullPrice * 0.20;
    const netEarnings = fullPrice - commission;

    if (this.stats.walletBalance < commission) {
      this.triggerError(`
        <strong>Insufficient Commission Wallet Balance!</strong><br><br>
        To accept this job (Price: $${fullPrice}), a platform fee of <b>$${commission}</b> is required.<br>
        Your current balance is only <b>$${this.stats.walletBalance}</b>.
      `);
      return;
    }

    this.triggerConfirm(
      'Accept Job?',
      `Are you sure you want to accept this booking?<br><br>
       <div style="text-align:left; background:#f9f9f9; padding:10px; border-radius:10px;">
         💰 <b>Commission (20%):</b> <span style="color:#ef4444">-$${commission}</span> (From Wallet)<br>
         💵 <b>Net Earning:</b> <span style="color:#166534">+$${netEarnings}</span> (Added to Cash)
       </div>
      `,
      () => {
        this.businessService.updateBookingStatus(booking.id, 'Accepted').subscribe({
          next: () => {
            this.loadDashboardData();
            this.triggerSuccess(`Booking Accepted! Commission of $${commission} deducted.`);
          },
          error: (err) => alert(err.error?.Message || "Failed to accept booking.")
        });
      }
    );
  }

  initDeclineBooking(booking: any) {
    this.triggerConfirm(
      'Decline Request?',
      `Are you sure you want to decline the request from <b>${booking.customerName}</b>? This cannot be undone.`,
      () => {
        this.businessService.updateBookingStatus(booking.id, 'Declined').subscribe({
          next: () => {
            this.loadDashboardData();
            this.triggerSuccess("Request Declined.");
          },
          error: () => alert("Failed to decline.")
        });
      }
    );
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
    formData.append('ServiceName', this.newService.serviceName || '');
    formData.append('Description', this.newService.description || '');
    const price = this.newService.price != null ? this.newService.price : 0;
    formData.append('Price', price.toString());
    const duration = this.newService.durationMinutes != null ? this.newService.durationMinutes : 0;
    formData.append('DurationMinutes', duration.toString());
    if (this.selectedFile) formData.append('image', this.selectedFile);

    if (this.isEditMode) {
      this.businessService.updateService(this.newService.id, formData).subscribe({
        next: () => {
          this.triggerSuccess('Service Updated!');
          this.loadDashboardData();
          this.switchTab('services');
        },
        error: () => { this.isLoading = false; alert('Failed.'); }
      });
    } else {
      this.businessService.addService(formData).subscribe({
        next: () => {
          this.triggerSuccess('Service Added!');
          this.loadDashboardData();
          this.switchTab('services');
        },
        error: () => { this.isLoading = false; alert('Failed.'); }
      });
    }
  }

  deleteService(id: number) {
    this.triggerConfirm('Delete Service?', 'Are you sure you want to delete this service permanently?', () => {
      this.businessService.deleteService(id).subscribe({
        next: () => this.loadDashboardData() 
      });
    });
  }
}