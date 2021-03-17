import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { Ingredient } from '../../../_models/ingredient.model';
import { IngredientsService } from '../../../_services';

@Component({
  selector: 'app-update-ingredients-status-modal',
  templateUrl: './update-ingredients-status-modal.component.html',
  styleUrls: ['./update-ingredients-status-modal.component.scss']
})
export class UpdateIngredientsStatusModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  status = 2;
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

  updateIngredientsStatus() {
    this.isLoading = true;
    const sb = this.ingredientsService.updateStatusForItems(this.ids, +this.status).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
