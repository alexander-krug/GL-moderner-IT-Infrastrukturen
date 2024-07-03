import { Component, OnInit } from '@angular/core';

import{ActivatedRoute, Params, Router} from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { DataStorageService } from '../../shared/data-storage.service';
import {RecipesService} from '../recipes.service';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router,
    private dataStorageService: DataStorageService,
     ){}

  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        console.log(this.editMode);
      }
    )
  }



  onAddIngredient(){
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]
       )
      })
    )
  }
  onAddStep(){
    (this.recipeForm.get('steps') as FormArray).push(
      new FormGroup({
        'description': new FormControl(null, Validators.required),
        'timer': new FormControl(null),
        'necessary': new FormControl(null),
        'duration': new FormControl(null,
           [
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
      })
    )
  }


  onSubmit(){
    const value = this.recipeForm.value;
    const recipe = new Recipe(
      value.name, value.description, value.imagePath, value.ingredients, value.steps);
      
    if(this.editMode){
      this.recipesService.updateRecipe(this.id, this.recipeForm.value);
    }
    else{
      this.recipesService.addRecipe(recipe);
    }
    this.navigateAway();
    this.dataStorageService.storeRecipes();
  }

  onCancel(){
    this.navigateAway();
  }

  onDeleteIngredient(index: number){
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
  onDeleteStep(index: number){
    (this.recipeForm.get('steps') as FormArray).removeAt(index);
  }
  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<FormGroup>([]);
    let recipeSteps = new FormArray<FormGroup>([]);

    if(this.editMode){
      const recipe = this.recipesService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if(recipe.ingredients){
        for (let ingredient of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount,
                 [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
            })
          )
        }
      }
      if(recipe.steps){
        for (let step of recipe.steps){
          recipeSteps.push(
            new FormGroup({
              'description': new FormControl(step.description, Validators.required),
              'timer': new FormControl<boolean>(step.timer),
              'necessary': new FormControl(step.necessary),
              'duration': new FormControl(step.duration,
                 [
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
            })
          )
        }
      } 
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required), 
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients,
      'steps': recipeSteps
    });
  }

  getIngredients(){
    return this.recipeForm.get('ingredients') as FormArray;
  }
  getSteps(){
    return this.recipeForm.get('steps') as FormArray;
  }
  private navigateAway(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
