import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {of, Subscription} from 'rxjs';
import {catchError, finalize, first, tap} from 'rxjs/operators';
import {Ingredient} from '../../../_models/ingredient.model';
import {IngredientsService} from '../../../_services';
import {CustomAdapter, CustomDateParserFormatter, getDateFromString} from '../../../../../_metronic/core';

const EMPTY_CUSTOMER: Ingredient = {
    id: undefined,
    title: '',
    image: '',
    image_file: undefined,
    aws_path: ''
};

@Component({
    selector: 'app-edit-ingredient-modal',
    templateUrl: './edit-ingredient-modal.component.html',
    styleUrls: ['./edit-ingredient-modal.component.scss'],
    // NOTE: For this example we are only providing current component, but probably
    // NOTE: you will w  ant to provide your main App Module
    providers: [
        {provide: NgbDateAdapter, useClass: CustomAdapter},
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ]
})
export class EditIngredientModalComponent implements OnInit, OnDestroy {
    @Input() id: number;
    isLoading$;
    ingredient: Ingredient;
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];

    constructor(
        private ingredientsService: IngredientsService,
        private fb: FormBuilder, public modal: NgbActiveModal
    ) {
    }

    ngOnInit(): void {
        this.isLoading$ = this.ingredientsService.isLoading$;
        this.loadIngredient();
    }

    loadIngredient() {
        if (!this.id) {
            this.ingredient = EMPTY_CUSTOMER;
            this.loadForm();
        } else {
            const sb = this.ingredientsService.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    this.modal.dismiss(errorMessage);
                    return of(EMPTY_CUSTOMER);
                })
            ).subscribe((ingredient: Ingredient) => {
                this.ingredient = ingredient;
                this.ingredient.aws_path = ingredient.image;
                this.loadForm();
            });
            this.subscriptions.push(sb);
        }
    }

    loadForm() {
        this.formGroup = this.fb.group({
            title: [this.ingredient.title, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
            image: [this.ingredient.image, Validators.compose([Validators.required])],
        });
    }

    save() {
        this.prepareIngredient();
        if (this.ingredient.id) {
            this.edit();
        } else {
            this.create();
        }
    }

    getPic() {
        if (!this.ingredient.image) {
            return 'none';
        }

        return `url('${this.ingredient.image}')`;
    }

    changePic(event) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);

            reader.onload = () => {

                this.ingredient.image = reader.result as string;
                this.ingredient.image_file = event.target.files;
            };

        }

    }

    deletePic() {
        this.ingredient.image = '';
    }

    async edit() {
        try {
            const Uploaded = await this.ingredientsService.uploadFile(this.ingredient.image_file.item(0));
            this.ingredient.aws_path = Uploaded.Location;
            const sbUpdate = this.ingredientsService.update(this.ingredient).pipe(
                tap(() => {
                    this.modal.close();
                }),
                catchError((errorMessage) => {
                    this.modal.dismiss(errorMessage);
                    return of(this.ingredient);
                }),
            ).subscribe(res => this.ingredient = res);
            this.subscriptions.push(sbUpdate);
        }catch (error) {
            console.log(error);
        }
    }

    async create() {
        try {
            const Uploaded = await this.ingredientsService.uploadFile(this.ingredient.image_file.item(0));
            this.ingredient.aws_path = Uploaded.Location;
            const sbCreate = this.ingredientsService.create(this.ingredient).pipe(
                tap(() => {
                    this.modal.close();
                    this.ingredient.image = '';
                    this.ingredient.title = '';
                }),
                catchError((errorMessage) => {
                    this.modal.dismiss(errorMessage);
                    return of(this.ingredient);
                }),
            ).subscribe((res: Ingredient) => this.ingredient = res);
            this.subscriptions.push(sbCreate);
        } catch (error) {
            console.log(error);
        }
    }

    upload() {
        alert('sdfsfd')
    }

    private prepareIngredient() {
        const formData = this.formGroup.value;
        this.ingredient.title = formData.title;
        this.ingredient.image = formData.image;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    // helpers for View
    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation, controlName): boolean {
        const control = this.formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName): boolean {
        const control = this.formGroup.controls[controlName];
        return control.dirty || control.touched;
    }
}
