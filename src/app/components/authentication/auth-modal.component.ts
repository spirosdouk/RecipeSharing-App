import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-modal">
      <h2>{{ isLoginMode ? 'Login' : 'Sign Up' }}</h2>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            class="form-control"
            placeholder="Email Address"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-container">
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              class="form-control"
              placeholder="Password"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn btn-primary">
          {{ isLoginMode ? 'Login' : 'Sign Up' }}
        </button>
      </form>

      <p class="toggle-mode">
        {{
          isLoginMode ? "Don't have an account?" : 'Already have an account?'
        }}
        <a href="#" (click)="toggleMode(); $event.preventDefault()">
          {{ isLoginMode ? 'Sign up' : 'Login' }}
        </a>
      </p>

      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent {
  email: string = '';
  password: string = '';
  isLoginMode: boolean = true;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AuthModalComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.login();
    } else {
      this.signup();
    }
  }

  login(): void {
    const loginData = { email: this.email, password: this.password };
    this.http.post('/api/auth/login', loginData).subscribe({
      next: (response: any) => {
        const { token, userId } = response;
        this.authService.login(token, userId);
        this.dialogRef.close();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please try again.';
      },
    });
  }

  signup(): void {
    const signupData = { email: this.email, password: this.password };
    this.http.post('/api/auth/register', signupData).subscribe({
      next: (response: any) => {
        const { token, userId } = response;
        this.authService.login(token, userId);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage =
          error.error.message || 'Signup failed. Please try again.';
      },
    });
  }
}
