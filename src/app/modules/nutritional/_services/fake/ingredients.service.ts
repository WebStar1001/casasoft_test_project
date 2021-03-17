import {Injectable, OnDestroy, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {
    TableService,
    TableResponseModel,
    ITableState,
    BaseModel,
    PaginatorState,
    SortState,
    GroupingState
} from '../../../../_metronic/shared/crud-table';
import {Ingredient} from '../../_models/ingredient.model';
import {baseFilter} from '../../../../_fake/fake-helpers/http-extenstions';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

const DEFAULT_STATE: ITableState = {
    filter: {},
    paginator: new PaginatorState(),
    sorting: new SortState(),
    searchTerm: '',
    grouping: new GroupingState(),
    entityId: undefined
};
const bucket = new S3(
    {
        accessKeyId: 'AKIAZ3GF5ZKQBLUPTH22',
        secretAccessKey: '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',
        region: 'us-east-1'
    }
);

@Injectable({
    providedIn: 'root'
})
export class IngredientsService extends TableService<Ingredient> implements OnDestroy {
    API_URL = `${environment.apiUrl}/ingredients`;

    constructor(@Inject(HttpClient) http) {
        super(http);
    }

    // READ
    find(tableState: ITableState): Observable<TableResponseModel<Ingredient>> {
        return this.http.get<Ingredient[]>(this.API_URL).pipe(
            map((response: Ingredient[]) => {
                const filteredResult = baseFilter(response, tableState);
                const result: TableResponseModel<Ingredient> = {
                    items: filteredResult.items,
                    total: filteredResult.total
                };
                return result;
            })
        );
    }

    async uploadFile(file) {
        const contentType = file.type;
        const params = {
            Bucket: 'casasoftbucket',
            Key: 'ingredients' + file.name,
            Body: file,
            ACL: 'public-read',
            ContentType: contentType
        };
        return bucket.upload(params).promise();
    }

    deleteItems(ids: number[] = []): Observable<any> {
        const tasks$ = [];
        ids.forEach(id => {
            tasks$.push(this.delete(id));
        });
        return forkJoin(tasks$);
    }

    updateStatusForItems(ids: number[], status: number): Observable<any> {
        return this.http.get<Ingredient[]>(this.API_URL).pipe(
            map((ingredients: Ingredient[]) => {
                return ingredients.filter(c => ids.indexOf(c.id) > -1).map(c => {
                    c.id = status;
                    return c;
                });
            }),
            exhaustMap((ingredients: Ingredient[]) => {
                const tasks$ = [];
                ingredients.forEach(ingredient => {
                    tasks$.push(this.update(ingredient));
                });
                return forkJoin(tasks$);
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
