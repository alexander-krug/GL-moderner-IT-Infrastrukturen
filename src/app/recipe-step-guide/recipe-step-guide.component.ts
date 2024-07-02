import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipesService } from '../recipes/recipes.service';
import { Step } from '../shared/step.model';
import { NgIf, NgFor } from '@angular/common';
import { Ingredient } from '../shared/ingredient.model';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
@Component({
  selector: 'app-recipe-step-guide',
  standalone: true,
  imports: [NgIf, NgFor, CountdownComponent],
  templateUrl: './recipe-step-guide.component.html',
  styleUrls: ['./recipe-step-guide.component.css']
})
export class RecipeStepGuideComponent implements OnInit {
handleEvent($event: Event) {
throw new Error('Method not implemented.');
}
  done = false;
  currentStep: number = -1;
  steps : Step[] | undefined;
  ingredients: Ingredient[] | undefined;	
  index: number | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router,
     ){}
  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {
        this.index = +params['id'];
      }
    )
    
    console.log(this.index);
    const recipe = this.recipesService.getRecipe(this.index!);
    this.steps = recipe.steps;
    this.ingredients = recipe.ingredients;
    console.log(this.steps);
  }

  nextStep() {
    if (this.currentStep < this.steps!.length - 1) {
      this.currentStep++;
      this.done=false
    }
  }

  previousStep() {
    if (this.currentStep >= 0) {
      this.currentStep--;
      this.done=false
    }
  }

  onTimerFinished(e: CountdownEvent) {
    if (e.action == 'done') {
      this.done=true
    }
  }
}