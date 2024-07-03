import { Subject } from 'rxjs';

import {Ingredient} from '../shared/ingredient.model';

export class ShoppingListService{
    startEditing = new Subject<number>();
    ingredientsChanged = new Subject<Ingredient[]>();
    



    private ingredients: Ingredient[] = [
        // new Ingredient('Äpfel', 5),
        // new Ingredient('Tomaten', 10),
      ];

      getIngredients(){
        console.log(this.ingredients)
        return this.ingredients;
        
      }

      getIngredient(index: number){
        return this.ingredients[index];
      }

      addIngredients(ingredientsIn: Ingredient[]){
        for (let ing of ingredientsIn){
          var found = false;
          for (let ingAlt of this.ingredients){
            if (ingAlt.name==ing.name){
              found = true;
              console.log(ingAlt.amount);
              console.log(ing.amount);
              ingAlt.amount += ing.amount;
              console.log(ingAlt.amount);
              console.log(ing.amount);
              break;
            } 
          }
          if (found == false){
            this.ingredients.push(ing);
          } 
        }

        this.ingredientsChanged.next(this.ingredients.slice());
      }

      addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
      }

      updateIngredient(index: number, ingredient: Ingredient){
        this.ingredients[index] = ingredient;
        this.ingredientsChanged.next(this.ingredients.slice());
      }


      deleteItem(index: number){
          this.ingredients.splice(index, 1);
          this.ingredientsChanged.next(this.ingredients.slice());
      }

      new(){
        this.ingredients = [];
        this.ingredientsChanged.next(this.ingredients.slice());
    }

      clearIngsArray(){
        this.ingredients.splice(0, this.ingredients.length);
        this.ingredientsChanged.next(this.ingredients.slice());
      }
}
