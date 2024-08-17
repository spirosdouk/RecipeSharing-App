import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          [(ngModel)]="email"
          name="email"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          [(ngModel)]="password"
          name="password"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  `,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<LoginComponent>
  ) {}

  onSubmit(): void {
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
}
