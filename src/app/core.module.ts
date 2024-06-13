import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RecipesService } from "./recipes/recipes.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";


@NgModule({
  providers: [
    RecipesService, 
    ShoppingListService,
  ],
})
export class CoreModule {

}