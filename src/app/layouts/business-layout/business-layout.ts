import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // 1. Import RouterOutlet

@Component({
  selector: 'app-business-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet // 2. Add it to this imports array
  ],
  templateUrl: './business-layout.html', // Matches your file name
  styleUrls: ['./business-layout.scss']  // Matches your file name
})
export class BusinessLayoutComponent {

}