import { Component, OnInit } from '@angular/core';
import { RecipeService } from './services/recipe.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main class="content container mt-3">
      <h1>Recipe List</h1>
      <app-search-bar (search)="onSearch($event)"></app-search-bar>
      <div infiniteScroll [infiniteScrollDistance]="2" [infiniteScrollUpDistance]="1.5"
        [infiniteScrollThrottle]="150" (scrolled)="onScroll()">
        <app-recipe-list [recipes]="recipes"></app-recipe-list>
      </div>
    </main>
  `,
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    SearchBarComponent,
    RecipeListComponent,
    InfiniteScrollDirective
  ]})
export class AppComponent implements OnInit {
  recipes: any[] = [];
  query: string = 'pasta';
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.getRecipes(this.query);
  }

  onSearch(query: string): void {
    this.query = query;
    this.recipes = [];
    this.offset = 0;
    this.getRecipes(this.query);
  }

  onScroll(): void {
    if (!this.loading) {
      this.offset += this.limit;
      this.getRecipes(this.query);
    }
  }

  getRecipes(query: string): void {
    console.log('Fetching recipes for query:', query);
    this.loading = true;
    this.recipeService.getRecipes(query, this.offset, this.limit).subscribe(
      (recipes) => {
        this.recipes = this.recipes.concat(recipes);
        console.log('Recipes fetched:', this.recipes);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching recipes', error);
        this.loading = false;
      }
    );
  }
}
