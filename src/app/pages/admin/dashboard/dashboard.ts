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
  
  stats: any = { totalUsers: 0, totalBusinesses: 0, pendingApprovals: 0, totalBookings: 0, platformRevenue: 0 };
  pendingBusinesses: any[] = [];
  users: any[] = [];

  // MODAL STATE
  showConfirmModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  modalType: 'delete' | 'approve' | 'reject' = 'delete';
  modalBtnText: string = 'Confirm';
  
  onConfirmAction: () => void = () => {};

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
    this.adminService.getStats().subscribe(data => this.stats = data); 
  }

  loadPending() { this.adminService.getPendingBusinesses().subscribe(data => this.pendingBusinesses = data); }
  loadUsers() { this.adminService.getAllUsers().subscribe(data => this.users = data); }

  // MODAL LOGIC
  triggerConfirm(type: 'delete' | 'approve' | 'reject', title: string, msg: string, btnText: string, action: () => void) {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = msg;
    this.modalBtnText = btnText;
    this.onConfirmAction = () => {
      action();
      this.showConfirmModal = false;
    };
    this.showConfirmModal = true;
  }

  closeModal() {
    this.showConfirmModal = false;
  }

  // ACTIONS
  confirmApprove(id: number) { 
    this.triggerConfirm('approve', 'Approve Business?', 'Are you sure you want to approve this business?', 'Approve', () => {
      this.adminService.updateBusinessStatus(id, 'Active').subscribe(() => this.loadPending());
    });
  }
  
  confirmReject(id: number) { 
    this.triggerConfirm('reject', 'Reject Business?', 'Are you sure you want to reject this business?', 'Reject', () => {
      this.adminService.updateBusinessStatus(id, 'Rejected').subscribe(() => this.loadPending());
    });
  }
  
  confirmDeleteUser(id: number) { 
    this.triggerConfirm('delete', 'Delete User?', 'Are you sure you want to permanently delete this user?', 'Delete User', () => {
      this.adminService.deleteUser(id).subscribe(() => this.loadUsers());
    });
  }
}