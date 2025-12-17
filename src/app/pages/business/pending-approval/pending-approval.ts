import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BusinessService } from '../../../services/business.service';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-approval.html',
  styleUrls: ['./pending-approval.scss']
})
export class PendingApprovalComponent {

  isLoading: boolean = false;

  // Modal State
  showPendingModal: boolean = false;
  showApprovedModal: boolean = false;
  showRejectedModal: boolean = false;

  constructor(
    private authService: AuthService,
    private businessService: BusinessService,
    private router: Router
  ) {}

  checkStatus() {
    this.isLoading = true;
    this.businessService.getMyProfile().subscribe({
      next: (data) => {
        this.isLoading = false;
        
        if (data.status === 'Active') {
          this.showApprovedModal = true;
        } else if (data.status === 'Rejected') {
          this.showRejectedModal = true;
        } else {
          this.showPendingModal = true;
        }
      },
      error: () => {
        this.isLoading = false;
        // Optional: Show error modal or just Pending
        this.showPendingModal = true; 
      }
    });
  }

  closeModals() {
    this.showPendingModal = false;
    this.showApprovedModal = false;
    this.showRejectedModal = false;
  }

  goToDashboard() {
    this.closeModals();
    this.router.navigate(['/business/manage-services']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}