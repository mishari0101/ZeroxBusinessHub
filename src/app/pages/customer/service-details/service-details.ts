import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-details.html',
  styleUrls: ['./service-details.scss']
})
export class ServiceDetails implements OnInit {

  businessId: any;
  business: any = null;
  services: any[] = [];
  isLoading: boolean = true;

  // Booking State
  showBookingModal: boolean = false;
  selectedService: any = null;
  
  // Form Data
  bookingData = {
    timeSlot: '',
    location: '',
    paymentMethod: 'Cash' // Default
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.businessId = this.route.snapshot.paramMap.get('id');
    this.loadBusinessDetails(this.businessId);
  }

  loadBusinessDetails(id: any) {
    this.isLoading = true;
    this.customerService.getBusinessDetails(id).subscribe({
      next: (data: any) => {
        this.business = {
          name: data.businessName,
          category: data.category,
          description: data.description || 'No description available.',
          address: data.address,
          profileImg: data.businessImage || 'assets/img/placeholder-profile.jpg'
        };

        this.services = (data.services || []).map((s: any) => ({
          id: s.id,
          name: s.serviceName,
          description: s.description,
          price: s.price,
          duration: s.durationMinutes,
          img: s.img || s.Img || 'assets/img/placeholder.jpg' 
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading details', err);
        this.isLoading = false;
      }
    });
  }

  // --- BOOKING LOGIC ---

  openBookingModal(service: any) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
      return;
    }
    this.selectedService = service;
    this.showBookingModal = true;
  }

  closeModal() {
    this.showBookingModal = false;
    // Reset Data
    this.bookingData = { timeSlot: '', location: '', paymentMethod: 'Cash' };
  }

  // Select Payment Method
  selectPayment(method: string) {
    this.bookingData.paymentMethod = method;
  }

  confirmBooking() {
    if(!this.bookingData.timeSlot || !this.bookingData.location) {
      alert("Please fill all details.");
      return;
    }

    const payload = {
      serviceId: this.selectedService.id,
      timeSlot: this.bookingData.timeSlot,
      location: this.bookingData.location,
      paymentMethod: this.bookingData.paymentMethod
    };

    this.customerService.createBooking(payload).subscribe({
      next: () => {
        alert("Booking Request Sent Successfully!");
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        alert("Booking Failed. Please try again.");
      }
    });
  }
  
  goBack() { this.router.navigate(['/']); }
}