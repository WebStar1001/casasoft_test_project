import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Ingredient } from '../../../_models/ingredient.model';
import { IngredientsService } from '../../../_services';

@Component({
  selector: 'app-fetch-ingredients-modal',
  templateUrl: './fetch-ingredients-modal.component.html',
  styleUrls: ['./fetch-ingredients-modal.component.scss']
})
export class FetchIngredientsModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  ingredients: Ingredient[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private ingredientsService: IngredientsService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients() {
    const sb = this.ingredientsService.items$.pipe(
      first()
    ).subscribe((res: Ingredient[]) => {
      this.ingredients = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  fetchSelected() {
    this.isLoading = true;
    // just imitation, call server for fetching data
    setTimeout(() => {
      this.isLoading = false;
      this.modal.close();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
