import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  searchQuery: string = '';
  selectedCategory: string = 'All';
  
  // 🔥 NEW: Selected District (Default is empty = use Registered User Location)
  selectedDistrict: string = ''; 
  isLoading: boolean = true; 

  // Sri Lanka Districts (+ All Island Option)
  districts = [
    'All Island',
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  categories = ['Mechanic', 'Salon', 'Cleaning', 'Plumber', 'Electrician', 'Tutor'];
  
  businesses: any[] = [];
  filteredBusinesses: any[] = [];

  constructor(private router: Router, private customerService: CustomerService) {} 

  ngOnInit() {
    this.loadBusinesses();
  }

  // 🔥 UPDATED: Load Logic
  loadBusinesses() {
    this.isLoading = true;
    
    // Pass the selectedDistrict (if it's empty, backend uses registered address)
    this.customerService.getAllBusinesses(this.selectedDistrict).subscribe({
      next: (data: any) => {
        if (!data) { this.isLoading = false; return; }

        this.businesses = data.map((item: any) => ({
          id: item.id || item.Id,
          name: item.businessName || item.BusinessName, 
          category: item.category || item.Category || 'Service', 
          location: item.address || item.Address || 'City Center',
          district: item.district || item.District, // Store district
          rating: item.rating || 4.5, 
          img: item.img || 'assets/img/placeholder-profile.jpg' 
        }));

        this.filteredBusinesses = this.businesses;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  // 🔥 NEW: Handle District Dropdown Change
  onDistrictChange() {
    this.loadBusinesses(); // Reload data from backend based on new selection
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
    console.log("Navigating to business ID:", id);
    this.router.navigate(['/service-details', id]); 
  }
}