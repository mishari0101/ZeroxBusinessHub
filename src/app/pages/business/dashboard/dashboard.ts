import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// Check relative path carefully. Usually ../../../services/business.service
import { BusinessService } from '../../../services/business.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './dashboard.html', // Changed to match your file
  styleUrls: ['./dashboard.scss']  // Changed to match your file
})
export class DashboardComponent implements OnInit {

  profile: any = null;
  isLoading: boolean = true;

  constructor(private businessService: BusinessService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.businessService.getMyProfile().subscribe({
      next: (res) => {
        console.log('Dashboard Data:', res);
        this.profile = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.isLoading = false;
        if(err.status === 404) {
          // If no profile found, go to setup page
          this.router.navigate(['/business/profile-setup']);
        }
      }
    });
  }
}