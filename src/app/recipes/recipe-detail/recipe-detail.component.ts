import { Component, OnInit } from '@angular/core';

import {Recipe} from '../recipe.model'
import {ShoppingListService} from '../../shopping-list/shopping-list.service';
import {RecipesService} from '../recipes.service';

import {ActivatedRoute, Params, Router} from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeToDisplay!:Recipe;
  id!: number;
  amount = 1;
  ingredientsVorhanden = Array<Ingredient>()

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
        
        for (var ingredientVorhanden of this.ingredientsVorhanden){
          if (ingredientAdd.name == ingredientVorhanden.name) {
            ingredientAdd.amount=ingredientAdd.amount-ingredientVorhanden.amount
          }
        }
      }
      this.slService.addIngredients(toAdd.ingredients);
    }
  }

  onDeleteRecipe(){
    this.recipesService.deleteRecipe(this.id);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  updateAmount(event: any){
    this.amount=event.target.value
  }
  updateVorhanden(event: any, name: string){
    var vorhandenFound=false
    for (let item of this.ingredientsVorhanden) {
      if (item.name==name){
        item.amount=event.target.value;
        vorhandenFound=true
      } 
    }

    if (vorhandenFound==false) {
      this.ingredientsVorhanden.push({"name": name, "amount": event.target.value})
    }
    console.log(event.target.value)
  }
}
