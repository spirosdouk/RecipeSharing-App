import { Injectable } from '@angular/core';
import { environment } from './environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://api.spoonacular.com/recipes/';
  private apiKey = environment.spoonacularApiKey;

  constructor() { }

  async getRecipes(query: string): Promise<any> {
    const url = `${this.apiUrl}search?apiKey=${this.apiKey}&query=${query}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  }

  async getRecipeById(id: number): Promise<any> {
    try {
      const url = `${this.apiUrl}${id}/information?apiKey=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        } else {
          throw new Error('Failed to fetch recipe');
        }
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return undefined;
    }
  }
}
