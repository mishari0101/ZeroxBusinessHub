import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// Note: importing from 'public' because your file is named public.ts
import { PublicService } from '../../../services/public'; 

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
  isLoading: boolean = true;

  // 1. Categories (Starts with All, fills dynamically from DB)
  categories: string[] = ['All']; 

  // 2. Data Arrays
  services: any[] = [];
  filteredServices: any[] = [];

  constructor(
    private router: Router,
    private publicService: PublicService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // 🔥 Fetch Real Data from API
  loadData() {
    this.isLoading = true;
    this.publicService.getAllBusinesses().subscribe({
      next: (data) => {
        console.log('API Data:', data);

        // Map Backend DTO (BusinessViewDto) to Frontend Variables
        this.services = data.map((b: any) => ({
            id: b.id,
            name: b.businessName,        // mapped from businessName
            category: b.category,        // mapped from category
            location: b.address,         // mapped from address
            rating: 4.5,                 // Default rating (backend doesn't send yet)
            price: 500,                  // Default starting price
            img: b.businessImage         // mapped from businessImage
        }));

        this.filteredServices = this.services;

        // 🔥 Fix: Dynamic Categories
        // Extract unique categories from the data and add them to the list
        const uniqueCats = [...new Set(data.map((b: any) => b.category))];
        this.categories = ['All', ...uniqueCats as string[]];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false;
      }
    });
  }

  // Filter Logic
  filterCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter(s => s.category === category);
    }
  }

  // Search Logic
  onSearch() {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredServices = this.services.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.category.toLowerCase().includes(query)
      );
    } else {
      this.filteredServices = this.services;
    }
  }

  // Navigation Logic
  viewDetails(id: number) {
    this.router.navigate(['/customer/business', id]);
  }
}