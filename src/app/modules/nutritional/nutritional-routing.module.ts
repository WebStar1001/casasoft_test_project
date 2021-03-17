import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NutritionalComponent } from './nutritional.component';
import { IngredientsComponent } from './ingredients/ingredients.component';

const routes: Routes = [
  {
    path: '',
    component: NutritionalComponent,
    children: [
      {
        path: 'ingredients',
        component: IngredientsComponent,
      },
      { path: '', redirectTo: 'ingredients', pathMatch: 'full' },
      { path: '**', redirectTo: 'ingredients', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NutritionalRoutingModule {}
