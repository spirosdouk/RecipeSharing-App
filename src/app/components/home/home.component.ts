import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.models';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-navbar></app-navbar>

    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to Recipe Hub</h1>
        <p>Your one-stop destination for delicious recipes.</p>
      </div>
    </section>

    <section class="featured-recipes">
      <div class="container">
        <app-recipe-list [recipes]="featuredRecipes"></app-recipe-list>
      </div>
    </section>

    <section class="categories">
      <div class="container">
        <h2 class="mb-4">Popular Categories</h2>

        <div class="mb-4">
          <h3 class="mb-3">Chinese Cuisine</h3>
          <div id="chineseCarousel" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div
                *ngFor="let recipe of chineseRecipes; let i = index"
                [ngClass]="{ 'carousel-item': true, active: i === 0 }"
              >
                <img
                  [src]="recipe.image"
                  class="d-block w-100"
                  [alt]="recipe.title"
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5>{{ recipe.title }}</h5>
                </div>
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#chineseCarousel"
              role="button"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#chineseCarousel"
              role="button"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="mb-3">Italian Cuisine</h3>
          <div id="italianCarousel" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div
                *ngFor="let recipe of italianRecipes; let i = index"
                [ngClass]="{ 'carousel-item': true, active: i === 0 }"
              >
                <img
                  [src]="recipe.image"
                  class="d-block w-100"
                  [alt]="recipe.title"
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5>{{ recipe.title }}</h5>
                </div>
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#italianCarousel"
              role="button"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#italianCarousel"
              role="button"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="mb-3">Greek Cuisine</h3>
          <div id="greekCarousel" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div
                *ngFor="let recipe of greekRecipes; let i = index"
                [ngClass]="{ 'carousel-item': true, active: i === 0 }"
              >
                <img
                  [src]="recipe.image"
                  class="d-block w-100"
                  [alt]="recipe.title"
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5>{{ recipe.title }}</h5>
                </div>
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#greekCarousel"
              role="button"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#greekCarousel"
              role="button"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="call-to-action">
      <div class="container">
        <h2>Choose The Ingredients For a Custom Recipe</h2>
        <a routerLink="/custom-search" class="btn btn-primary">Get Started</a>
      </div>
    </section>

    <footer>
      <div class="container footer-content">
        <nav>
          <a routerLink="/privacy">Privacy Policy</a>
          <a routerLink="/terms">Terms of Service</a>
        </nav>
        <div class="social-media">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatDialogModule,
    SearchBarComponent,
    RecipeListComponent,
    NavbarComponent,
  ],
})
export class HomeComponent implements OnInit {
  featuredRecipes: any[] = [];
  chineseRecipes: any[] = [];
  italianRecipes: any[] = [];
  greekRecipes: any[] = [];
  private savedRecipeIds: number[] = [];

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSavedRecipeIds();
    this.loadRecipes();
  }

  loadSavedRecipeIds(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.recipeService.getSavedRecipesForUser(Number(userId)).subscribe({
        next: (recipes) => {
          this.savedRecipeIds = recipes.map((recipe) => recipe.id);
        },
        error: (error) => console.error('Error fetching saved recipes:', error),
      });
    }
  }

  loadRecipes(): void {
    this.recipeService.getFeaturedRecipes().subscribe((recipes) => {
      this.featuredRecipes = this.markRecipesAsLiked(recipes);
    });
    this.recipeService.getChineseRecipes().subscribe((recipes) => {
      this.chineseRecipes = this.markRecipesAsLiked(recipes);
    });
    this.recipeService.getItalianRecipes().subscribe((recipes) => {
      this.italianRecipes = this.markRecipesAsLiked(recipes);
    });
    this.recipeService.getGreekRecipes().subscribe((recipes) => {
      this.greekRecipes = this.markRecipesAsLiked(recipes);
    });
  }

  markRecipesAsLiked(recipes: Recipe[]): Recipe[] {
    return recipes.map((recipe) => {
      return {
        ...recipe,
        saved: this.savedRecipeIds.includes(recipe.id),
      };
    });
  }
}
