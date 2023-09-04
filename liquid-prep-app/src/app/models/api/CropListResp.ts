import { Crop } from '../Crop';
import { BaseResponse } from './BaseResponse';

export interface CropListResp extends BaseResponse {
  data: {
    docs: Crop[];
    bookmark: string;
    warning: string;
  };
}
