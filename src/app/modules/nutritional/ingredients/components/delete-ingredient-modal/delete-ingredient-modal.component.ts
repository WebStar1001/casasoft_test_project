import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { IngredientsService } from '../../../_services';

@Component({
  selector: 'app-delete-ingredient-modal',
  templateUrl: './delete-ingredient-modal.component.html',
  styleUrls: ['./delete-ingredient-modal.component.scss']
})
export class DeleteIngredientModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private ingredientsService: IngredientsService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteIngredient() {
    this.isLoading = true;
    const sb = this.ingredientsService.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
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
