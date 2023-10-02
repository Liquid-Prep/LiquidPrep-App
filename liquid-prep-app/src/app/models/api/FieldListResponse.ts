import { FieldInfo } from '../FieldStatic';
import { BaseResponse } from './BaseResponse';

export class FieldListResponse extends BaseResponse {
    data: FieldInfo[];
}