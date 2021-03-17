import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { NutritionalComponent } from './nutritional.component';
import { NutritionalRoutingModule } from './nutritional-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteIngredientModalComponent } from './ingredients/components/delete-ingredient-modal/delete-ingredient-modal.component';
import { DeleteIngredientsModalComponent } from './ingredients/components/delete-ingredients-modal/delete-ingredients-modal.component';
import { FetchIngredientsModalComponent } from './ingredients/components/fetch-ingredients-modal/fetch-ingredients-modal.component';
import { UpdateIngredientsStatusModalComponent } from './ingredients/components/update-ingredients-status-modal/update-ingredients-status-modal.component';
import { EditIngredientModalComponent } from './ingredients/components/edit-ingredient-modal/edit-ingredient-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    IngredientsComponent,
    NutritionalComponent,
    DeleteIngredientModalComponent,
    DeleteIngredientsModalComponent,
    FetchIngredientsModalComponent,
    UpdateIngredientsStatusModalComponent,
    EditIngredientModalComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NutritionalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule
  ],
  entryComponents: [
    DeleteIngredientModalComponent,
    DeleteIngredientsModalComponent,
    UpdateIngredientsStatusModalComponent,
    FetchIngredientsModalComponent,
    EditIngredientModalComponent,
  ]
})
export class NutritionalModule {}
