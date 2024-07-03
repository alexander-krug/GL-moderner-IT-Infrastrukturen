import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import{Router, ActivatedRoute} from '@angular/router';
import{Subscription} from 'rxjs';
import { DataStorageService } from '../../shared/data-storage.service';

import { Recipe } from '../recipe.model';
import{RecipesService} from '../recipes.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
recipes: Recipe[] = [];
recipesChangedSubscription!: Subscription;


  constructor(
              private recipesService: RecipesService,
              private router: Router,
              private route: ActivatedRoute,
              private dataStorageService: DataStorageService,
              ){}

  ngOnInit(){
    this.dataStorageService.fetchRecipes().subscribe();
    this.recipes = this.recipesService.getRecipes();
    this.recipesChangedSubscription = this.recipesService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    )
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(){
    this.recipesChangedSubscription.unsubscribe();
  }

}
