// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IngredientsService } from '../_services';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { DeleteIngredientModalComponent } from './components/delete-ingredient-modal/delete-ingredient-modal.component';
import { DeleteIngredientsModalComponent } from './components/delete-ingredients-modal/delete-ingredients-modal.component';
import { UpdateIngredientsStatusModalComponent } from './components/update-ingredients-status-modal/update-ingredients-status-modal.component';
import { FetchIngredientsModalComponent } from './components/fetch-ingredients-modal/fetch-ingredients-modal.component';
import { EditIngredientModalComponent } from './components/edit-ingredient-modal/edit-ingredient-modal.component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
})
export class IngredientsComponent
  implements
  OnInit,
  OnDestroy,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public ingredientService: IngredientsService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.ingredientService.fetch();
    this.grouping = this.ingredientService.grouping;
    this.paginator = this.ingredientService.paginator;
    this.sorting = this.ingredientService.sorting;
    const sb = this.ingredientService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      type: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['type'] = type;
    }
    this.ingredientService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.ingredientService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.ingredientService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.ingredientService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditIngredientModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.ingredientService.fetch(),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteIngredientModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.ingredientService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteIngredientsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.ingredientService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateIngredientsStatusModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.ingredientService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(FetchIngredientsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.ingredientService.fetch(), () => { });
  }
}
