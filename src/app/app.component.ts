import { Component, OnInit } from '@angular/core';
import { RecipeService } from './services/recipe.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-navbar (search)="onSearch($event)"></app-navbar>
    <main class="content container mt-3">
      <div infiniteScroll [infiniteScrollDistance]="2" [infiniteScrollUpDistance]="1.5"
        [infiniteScrollThrottle]="150" (scrolled)="onScroll()">
        <app-recipe-list [recipes]="recipes"></app-recipe-list>
      </div>
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </main>
  `,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NavbarComponent,
    SearchBarComponent,
    RecipeListComponent,
    InfiniteScrollDirective,
    MatDialogModule
  ]
})
export class AppComponent implements OnInit {
  recipes: any[] = [];
  query: string = 'pasta';
  cuisine: string = '';
  intolerances: string[] = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.getRecipes(this.query, this.cuisine, this.intolerances);
  }

  onSearch(searchParams: { query: string, cuisine: string, intolerances: string[] }): void {
    this.query = searchParams.query;
    this.cuisine = searchParams.cuisine;
    this.intolerances = searchParams.intolerances;
    this.recipes = [];
    this.offset = 0;
    this.getRecipes(this.query, this.cuisine, this.intolerances);
  }

  onScroll(): void {
    if (!this.loading) {
      this.offset += this.limit;
      this.getRecipes(this.query, this.cuisine, this.intolerances);
    }
  }

  getRecipes(query: string, cuisine: string, intolerances: string[]): void {
    console.log('Fetching recipes for query:', query, 'cuisine:', cuisine, 'intolerances:', intolerances);
    this.loading = true;
    this.errorMessage = null;
    this.recipeService.getRecipes(query, this.offset, this.limit, cuisine, intolerances).subscribe(
      (recipes) => {
        this.recipes = this.recipes.concat(recipes);
        console.log('Recipes fetched:', this.recipes);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        console.error('Error fetching recipes', error);
        this.loading = false;
      }
    );
  }
}
