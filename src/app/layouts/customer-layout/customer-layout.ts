import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router'; // Import these!

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // Add here
  templateUrl: './customer-layout.html',
  styleUrls: ['./customer-layout.scss']
})
export class CustomerLayoutComponent {
}