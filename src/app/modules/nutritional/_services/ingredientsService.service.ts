import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { Ingredient } from '../_models/ingredient.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService extends TableService<Ingredient> implements OnDestroy {
  API_URL = `${environment.apiUrl}/ingredients`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
