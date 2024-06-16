import { Component, Input, OnInit } from '@angular/core';

import { Recipe } from '../../recipe.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
   @Input() recipe!: Recipe;
   @Input() index!:number;

   constructor(
    private router: Router,
    private route: ActivatedRoute
    ){}

     ngOnInit(){

     }
     onStartRecipe(index: any){

      this.router.navigate([index+"/start"], {relativeTo: this.route}); 
    }
     
}
