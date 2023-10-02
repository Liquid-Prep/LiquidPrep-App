import { Inject, Injectable } from '@angular/core';
import { FieldListResponse } from '../models/api/FieldListResponse';
import { HttpClient } from '@angular/common/http';
import fieldMapping from '../models/json/fieldsStaticMapping.json';

@Injectable({
  providedIn: 'root'
})

export class FieldDataService {
  constructor(private http: HttpClient) {
  }
  getFieldData() {
    return fieldMapping;
  }
}
