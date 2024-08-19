import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

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
    </div>
  `,
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent {
  email: string = '';
  password: string = '';
  isLoginMode: boolean = true;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AuthModalComponent>
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.login();
    } else {
      this.signup();
    }
  }

  login() {
    const loginData = { email: this.email, password: this.password };
    this.http
      .post('http://localhost:3000/api/auth/login', loginData)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.dialogRef.close();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  signup() {
    const signupData = { email: this.email, password: this.password };
    this.http
      .post('http://localhost:3000/api/auth/register', signupData)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.dialogRef.close();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
