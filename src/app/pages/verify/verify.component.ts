import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  model: any = {};
  errorMessage: string = '';
  identifier: string | null = null;
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute // URL la irunthu data va eduka
  ) { }

  ngOnInit(): void {
    // Page load aagum pothu, URL la irunthu 'identifier' ah edukurom
    this.route.queryParamMap.subscribe(params => {
      this.identifier = params.get('identifier');
      this.model.identifier = this.identifier;
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.verify(this.model).subscribe({
      next: (response) => {
        console.log('Verification successful!', response);
        // TODO: Show a success message on the login page
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Verification failed', err);
        this.errorMessage = err.error?.Message || 'Verification failed. Please try again.';
      }
    });
  }
}