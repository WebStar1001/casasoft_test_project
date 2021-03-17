import {BaseModel} from '../../../_metronic/shared/crud-table';

export interface Ingredient extends BaseModel {
    id: number;
    title: string;
    image: string;
    image_file: FileList
    aws_path: String
}
