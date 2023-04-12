import { BaseResponse } from './BaseResponse';

export class cityData {
  city: string;
}

export class Data {
  location: cityData;
}

export class LocationResponse extends BaseResponse {
  data: Data;
}
