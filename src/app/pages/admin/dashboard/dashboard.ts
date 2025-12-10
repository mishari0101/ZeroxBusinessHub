import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class AdminDashboardComponent implements OnInit {

  activeTab = 'overview';
  
  // Initialize stats to avoid undefined errors
  stats: any = {
    totalUsers: 0,
    totalBusinesses: 0,
    pendingApprovals: 0,
    totalBookings: 0,
    platformRevenue: 0
  };
  
  pendingBusinesses: any[] = [];
  users: any[] = [];

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'overview';
      this.loadData();
    });
  }

  loadData() {
    if (this.activeTab === 'overview') this.loadStats();
    if (this.activeTab === 'approvals') this.loadPending();
    if (this.activeTab === 'users') this.loadUsers();
  }

  loadStats() { 
    this.adminService.getStats().subscribe(data => {
      this.stats = data;
      // Note: platformRevenue will come automatically from backend
    }); 
  }

  loadPending() { this.adminService.getPendingBusinesses().subscribe(data => this.pendingBusinesses = data); }
  loadUsers() { this.adminService.getAllUsers().subscribe(data => this.users = data); }

  approveBusiness(id: number) { 
      if(confirm('Approve this business?')) this.adminService.updateBusinessStatus(id, 'Active').subscribe(() => this.loadPending()); 
  }
  
  rejectBusiness(id: number) { 
      if(confirm('Reject this business?')) this.adminService.updateBusinessStatus(id, 'Rejected').subscribe(() => this.loadPending()); 
  }
  
  deleteUser(id: number) { 
      if(confirm('Permanently delete this user?')) this.adminService.deleteUser(id).subscribe(() => this.loadUsers()); 
  }
}