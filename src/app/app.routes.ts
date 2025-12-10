import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyComponent } from './pages/verify/verify.component';

// --- LAYOUTS ---
import { BusinessLayoutComponent } from './layouts/business-layout/business-layout'; 
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout'; // 🔥 FIXED IMPORT NAME

// --- PAGES ---
import { ProfileSetupComponent } from './pages/business/profile-setup/profile-setup';
import { ManageServicesComponent } from './pages/business/manage-services/manage-services';
import { DashboardComponent } from './pages/business/dashboard/dashboard'; 
import { HomeComponent } from './pages/customer/home/home';
import { ServiceDetails } from './pages/customer/service-details/service-details';
import { CustomerDashboardComponent } from './pages/customer/dashboard/dashboard'; 
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard'; 

export const routes: Routes = [
  
  // ==========================================
  // 1. CUSTOMER ROUTES (Root Path)
  // ==========================================
  { 
    path: '', 
    component: CustomerLayoutComponent,
    children: [
      { path: '', component: HomeComponent }, // Default Home Page
      { path: 'service-details/:id', component: ServiceDetails }, // Service Details
      { path: 'customer/dashboard', component: CustomerDashboardComponent } // Customer Dashboard
    ]
  },

  // ==========================================
  // 2. AUTH ROUTES
  // ==========================================
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },

  // ==========================================
  // 3. BUSINESS OWNER ROUTES
  // ==========================================
  { 
    path: 'business', 
    component: BusinessLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }, 
      { path: 'profile-setup', component: ProfileSetupComponent },
      { path: 'manage-services', component: ManageServicesComponent }
    ]
  },

  // ==========================================
  // 4. ADMIN ROUTES
  // ==========================================
  {
    path: 'admin',
    component: AdminLayoutComponent, // Uses Admin Sidebar Layout
    children: [
       { path: 'dashboard', component: AdminDashboardComponent },
       // Redirect /admin to /admin/dashboard by default
       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];