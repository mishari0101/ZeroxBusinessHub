import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 🔥 CRITICAL IMPORT
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from '../../../services/business.service';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-home',
  standalone: true,
  // 🔥 CRITICAL: CommonModule MUST be here for *ngIf and *ngFor to work
  imports: [CommonModule, FormsModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  searchQuery: string = '';
  selectedCategory: string = 'All';
  selectedDistrict: string = 'All Island';
  isLoading: boolean = true; 
  
  // Track Login Status
  isLoggedIn: boolean = false;

  districts = [
    'All Island', 'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  categories = ['Mechanic', 'Salon', 'Cleaning', 'Plumber', 'Electrician', 'Tutor'];
  
  businesses: any[] = [];
  filteredBusinesses: any[] = [];
  topProviders: any[] = [];

  constructor(
    private router: Router, 
    private customerService: CustomerService,
    private businessService: BusinessService, 
    private authService: AuthService
  ) {} 

  ngOnInit() {
    // 1. Check if User is Logged In
    this.isLoggedIn = this.authService.isLoggedIn();

    // 2. Load Data
    this.loadBusinesses();
  }

  loadBusinesses() {
    this.isLoading = true;
    
    // Get All Businesses
    this.customerService.getAllBusinesses(this.selectedDistrict).subscribe({
      next: (data: any) => {
        if (!data) { this.isLoading = false; return; }

        this.businesses = data.map((item: any) => ({
          id: item.id || item.Id,
          name: item.businessName || item.BusinessName, 
          category: item.category || item.Category || 'Service', 
          location: item.address || item.Address || 'City Center',
          district: item.district || item.District, 
          rating: item.rating || 4.5, 
          img: item.img || 'assets/img/placeholder-profile.jpg' 
        }));

        this.filteredBusinesses = this.businesses;
        this.topProviders = this.businesses.slice(0, 3); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  onDistrictChange() {
    this.loadBusinesses(); 
  }

  onSearch() {
    this.filterBusinesses();
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    this.filterBusinesses();
  }

  filterBusinesses() {
    this.filteredBusinesses = this.businesses.filter(b => {
      const matchesCategory = this.selectedCategory === 'All' || b.category.includes(this.selectedCategory);
      const matchesSearch = b.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  viewBusiness(id: any) {
    this.router.navigate(['/service-details', id]); 
  }
  
  goToDetails(id: any) {
    this.router.navigate(['/service-details', id]);
  }
}