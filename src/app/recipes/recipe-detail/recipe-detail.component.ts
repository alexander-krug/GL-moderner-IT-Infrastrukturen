import { Component, OnInit } from '@angular/core';

import {Recipe} from '../recipe.model'
import {ShoppingListService} from '../../shopping-list/shopping-list.service';
import {RecipesService} from '../recipes.service';

import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeToDisplay!:Recipe;
  id!: number;
  amount = 1;

  constructor(
              private slService: ShoppingListService,
              private recipesService: RecipesService,
              private route: ActivatedRoute,
              private router:Router,
              ){}

  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipeToDisplay = this.recipesService.getRecipe(this.id);
      }
    )
  }

  addToShoppingList(){
    if(this.recipeToDisplay?.ingredients){
      var toAdd = JSON.parse(JSON.stringify(this.recipeToDisplay))
      for (var ingredientAdd of toAdd.ingredients){
        ingredientAdd.amount=ingredientAdd.amount*this.amount
      }
      this.slService.addIngredients(toAdd.ingredients);
    }
  }

  onDeleteRecipe(){
    this.recipesService.deleteRecipe(this.id);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  updateAmount(event: any){
    this.amount=event.data
  }
  // updateVorhanden(event: any, name: string){
  //   console.log(name)
  //   for (let item of this.vorhanden) {
  //     if (item.name==name){
  //       item.value=event.data;
  //     }
  //     else {
  //       this.vorhanden.push({"name": name, "value": event.data})
  //     }
  //   }
  // }
}
