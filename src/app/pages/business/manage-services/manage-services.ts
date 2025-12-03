import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../../../services/business.service';

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-services.html',
  styleUrls: ['./manage-services.scss']
})
export class ManageServicesComponent implements OnInit {

  services: any[] = [];
  isLoading: boolean = false;
  
  showModal: boolean = false;
  isEditMode: boolean = false;

  newService: any = {
    id: 0,
    serviceName: '',
    description: '',
    price: 0,
    durationMinutes: 30,
    imageUrl: '' 
  };

  selectedFile: File | null = null;       
  selectedImagePreview: string | null = null; 

  constructor(private businessService: BusinessService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.isLoading = true;
    this.businessService.getMyProfile().subscribe({
      next: (data) => {
        this.services = data.services || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading services', err);
        this.isLoading = false;
      }
    });
  }

  openModal(service: any = null) {
    this.showModal = true;
    this.selectedFile = null; 
    this.selectedImagePreview = null; 

    if (service) {
      // Edit Mode
      this.isEditMode = true;
      this.newService = { ...service }; 
      if (service.imageUrl) {
        this.selectedImagePreview = service.imageUrl;
      }
    } else {
      // Add Mode
      this.isEditMode = false;
      this.newService = { 
        id: 0, 
        serviceName: '', 
        description: '', 
        price: 0, 
        durationMinutes: 30,
        imageUrl: ''
      };
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; 
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
  }

  // 🔥 UPDATED: Save (Add/Edit) Logic
  saveService() {
    this.isLoading = true;

    if (this.isEditMode) {
      // UPDATE
      this.businessService.updateService(this.newService.id, this.newService, this.selectedFile).subscribe({
        next: (res) => {
          alert('Service Updated Successfully!');
          this.closeModal();
          this.loadServices();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update service.');
          this.isLoading = false;
        }
      });
    } 
    else {
      // ADD
      this.businessService.addService(this.newService, this.selectedFile).subscribe({
        next: (res) => {
          alert('Service Added Successfully!');
          this.closeModal();
          this.loadServices(); 
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error adding service', err);
          alert('Failed to add service.');
          this.isLoading = false;
        }
      });
    }
  }

  // 🔥 UPDATED: Delete Logic
  deleteService(id: number) {
    if(confirm('Are you sure you want to delete this service?')) {
      this.businessService.deleteService(id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s.id !== id);
          alert('Service deleted.');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete service.');
        }
      });
    }
  }
}