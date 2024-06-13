import {Ingredient} from '../shared/ingredient.model';
import { Step } from '../shared/step.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public steps: Step[];


  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[], steps: Step[]){
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.steps = steps;
  }
}
