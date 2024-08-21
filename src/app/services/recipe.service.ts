import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, finalize, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

interface Recipe {
  id: number;
  title: string;
  image: string;
  sourceUrl: string;
  saved?: boolean;
}

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

  constructor(private http: HttpClient, private authService: AuthService) {}

  getRecipes(
    query: string,
    offset: number = 0,
    number: number = 10,
    cuisine?: string,
    intolerances: string[] = []
  ): Observable<any[]> {
    const userId = this.authService.getUserId();

    if (this.loadingSubject.value) {
      return of([]);
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

    if (intolerances.length > 0) {
      params = params.set('intolerances', intolerances.join(','));
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      switchMap((recipesResponse: any) => {
        const recipes = recipesResponse.results.map((recipe: any) => ({
          ...recipe,
          image: `https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg`,
          sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replace(
            / /g,
            '-'
          )}-${recipe.id}`,
        }));

        if (userId) {
          return this.http
            .get<number[]>(`/api/recipes/saved-recipes?userId=${userId}`)
            .pipe(
              map((savedRecipeIds: number[]) => {
                recipes.forEach((recipe: Recipe) => {
                  recipe.saved = savedRecipeIds.includes(recipe.id);
                });
                return recipes;
              })
            );
        } else {
          return of(recipes);
        }
      }),
      catchError((error) => {
        console.error('Error fetching recipes:', error);
        this.errorSubject.next(
          'Failed to fetch recipes. Please try again later.'
        );
        return of([]);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
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
          this.noMoreRecipesSubject.next(true);
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
      catchError((error) => {
        console.error('Error fetching more recipes:', error);
        this.errorSubject.next(
          'Failed to load more recipes. Please try again later.'
        );
        return of([]);
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
        catchError((error) => {
          console.error('Error fetching more recipes:', error);
          this.errorSubject.next(
            'Failed to load more recipes. Please try again later.'
          );
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (recipes) => {
          this.recipesSubject.next(recipes);
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

  getSavedRecipesForUser(userId: number): Observable<number[]> {
    return this.http.get<number[]>(
      `/api/recipes/saved-recipes?userId=${userId}`
    );
  }

  saveRecipe(recipe: any): Observable<any> {
    return this.http.post(`/api/recipes/saved-recipes`, { recipe }).pipe(
      catchError((error) => {
        console.error('Save recipe failed', error);
        return throwError(() => new Error('Save recipe failed'));
      })
    );
  }

  unsaveRecipe(userId: number, recipeId: number): Observable<any> {
    const url = `/api/recipes/saved-recipes?userId=${userId}&recipeId=${recipeId}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Unsave recipe failed', error);
        return throwError(() => new Error('Unsave recipe failed'));
      })
    );
  }
}
