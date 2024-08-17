import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipesSubject = new BehaviorSubject<any[]>([]);
  recipes$: Observable<any[]> = this.recipesSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$: Observable<string | null> = this.errorSubject.asObservable();

  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;
  private noMoreRecipesSubject = new BehaviorSubject<boolean>(false);
  noMoreRecipes$ = this.noMoreRecipesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRecipes(
    query: string,
    offset: number = 0,
    number: number = 10,
    cuisine?: string,
    intolerances?: string[]
  ): void {
    if (this.loadingSubject.value) {
      return;
    }

    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('query', query)
      .set('offset', offset.toString())
      .set('number', number.toString())
      .set('addRecipeInformation', 'true');

    if (cuisine) {
      params = params.set('cuisine', cuisine);
    }

    if (intolerances && intolerances.length) {
      params = params.set('intolerances', intolerances.join(','));
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http
      .get(this.apiUrl, { params })
      .pipe(
        map((response: any) => {
          if (response.results.length < number) {
            this.noMoreRecipesSubject.next(true); // No more recipes available
          }
          return response.results.map((recipe: any) => ({
            ...recipe,
            image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
            sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(
              / /g,
              '-'
            )}-${recipe.id}`,
          }));
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (recipes) => {
          if (offset === 0) {
            this.recipesSubject.next(recipes);
          } else {
            const currentRecipes = this.recipesSubject.value;
            this.recipesSubject.next([...currentRecipes, ...recipes]); // Append on scroll
          }
        },
        error: (error) => {
          this.noMoreRecipesSubject.next(true); // Stop fetching on error
          this.errorSubject.next(error.message);
        },
      });
  }

  fetchMoreRecipes(
    query: string,
    offset: number,
    number: number,
    cuisine?: string,
    intolerances?: string[]
  ): Observable<any> {
    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('query', query)
      .set('offset', offset.toString())
      .set('number', number.toString())
      .set('addRecipeInformation', 'true');

    if (cuisine) {
      params = params.set('cuisine', cuisine);
    }

    if (intolerances && intolerances.length) {
      params = params.set('intolerances', intolerances.join(','));
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => {
        if (response.results.length < number) {
          this.noMoreRecipesSubject.next(true); // No more recipes available
        }
        return response.results.map((recipe: any) => ({
          ...recipe,
          image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
          sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(
            / /g,
            '-'
          )}-${recipe.id}`,
        }));
      }),
      finalize(() => this.loadingSubject.next(false)),
      map((recipes) => {
        const currentRecipes = this.recipesSubject.value;
        this.recipesSubject.next([...currentRecipes, ...recipes]);
        return recipes;
      })
    );
  }

  getRecipesByIngredients(ingredients: string): void {
    if (this.loadingSubject.value) {
      return;
    }

    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('includeIngredients', ingredients)
      .set('number', '10')
      .set('addRecipeInformation', 'true');

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http
      .get(this.apiUrl, { params })
      .pipe(
        map((response: any) => {
          return response.results.map((recipe: any) => ({
            ...recipe,
            image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
            sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(
              / /g,
              '-'
            )}-${recipe.id}`,
          }));
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (recipes) => {
          this.recipesSubject.next(recipes);
        },
        error: (error) => {
          this.errorSubject.next(error.message);
        },
      });
  }

  private getRecipesByCuisine(
    cuisine: string,
    number: number = 10
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('cuisine', cuisine)
      .set('number', number.toString())
      .set('addRecipeInformation', 'true');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) =>
        response.results.map((recipe: any) => ({
          ...recipe,
          image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
          sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(
            / /g,
            '-'
          )}-${recipe.id}`,
        }))
      )
    );
  }

  getChineseRecipes(): Observable<any[]> {
    return this.getRecipesByCuisine('Chinese');
  }

  getItalianRecipes(): Observable<any[]> {
    return this.getRecipesByCuisine('Italian');
  }

  getGreekRecipes(): Observable<any[]> {
    return this.getRecipesByCuisine('Greek');
  }

  getFeaturedRecipes(): Observable<any[]> {
    return this.getRecipesByCuisine('', 9);
  }

  private localStorageKey = 'savedRecipes';

  saveRecipe(recipe: any): void {
    const savedRecipes = this.getSavedRecipesFromLocalStorage();
    if (!savedRecipes.find((savedRecipe) => savedRecipe.id === recipe.id)) {
      savedRecipes.push(recipe);
      localStorage.setItem(this.localStorageKey, JSON.stringify(savedRecipes));
      console.log('Recipe saved successfully!');
    }
  }

  unsaveRecipe(recipeId: string): void {
    const savedRecipes = this.getSavedRecipesFromLocalStorage().filter(
      (recipe) => recipe.id !== recipeId
    );
    localStorage.setItem(this.localStorageKey, JSON.stringify(savedRecipes));
    console.log('Recipe unsaved successfully!');
  }

  getSavedRecipes(): any[] {
    return this.getSavedRecipesFromLocalStorage();
  }

  private getSavedRecipesFromLocalStorage(): any[] {
    const savedRecipes = localStorage.getItem(this.localStorageKey);
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  }

  updateRecipeSavedState(recipes: any[]): void {
    const savedRecipes = this.getSavedRecipesFromLocalStorage();
    recipes.forEach((recipe) => {
      recipe.saved = savedRecipes.some(
        (savedRecipe) => savedRecipe.id === recipe.id
      );
    });
  }
}
