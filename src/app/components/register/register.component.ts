import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Register</h2>
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
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  `,
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<RegisterComponent>
  ) {}

  onSubmit(): void {
    const registerData = { email: this.email, password: this.password };
    this.http
      .post('http://localhost:3000/api/auth/register', registerData)
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
