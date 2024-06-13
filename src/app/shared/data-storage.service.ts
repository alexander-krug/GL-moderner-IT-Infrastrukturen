import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipesService } from "../recipes/recipes.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs";
import * as recipesJson from "../../assets/recipes.json";


@Injectable({
  providedIn: 'root'
})
export class DataStorageService{
  data: any = recipesJson;
  constructor(
    private http: HttpClient,
     private recipeService: RecipesService,
     ){}

  storeRecipes(){
    const recipes = this.recipeService.getRecipes();

    this.http.put(
      '../../assets/recipes.json"',
      recipes
    )
    .subscribe(response => {
      console.log('store Data', response);
    })
  }

  fetchRecipes(){
      return this.http.get<Recipe[]>(
        '../../assets/recipes.json')
        .pipe(
          map(recipes => {
            return recipes.map(recipe => {
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            })
          }),
          tap(recipes => {
            this.recipeService.setRecipes(recipes);
          })
        );

  }


}
