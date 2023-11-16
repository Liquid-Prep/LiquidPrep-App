import { Inject, Injectable } from '@angular/core';
import { from, Observable, Observer, of } from 'rxjs';
import { ImageMapping } from '../models/ImageMapping';
import { DataService } from './DataService';
import { HttpClient } from '@angular/common/http';
import {
  LOCAL_STORAGE,
  SESSION_STORAGE,
  StorageService,
} from 'ngx-webstorage-service';

import { DateTimeUtil } from '../utility/DateTimeUtil';
import { catchError, map, mergeMap, toArray } from 'rxjs/operators';
import { Field } from '../models/Field';
import config from '../../config.json';

const FIELD_LIST_KEY = 'field-list-test';
const FIELD_STORAGE_KEY = 'my-fields-test';

@Injectable({
  providedIn: 'root',
})
export class FieldDataService {
  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService,
    private dataService: DataService,
  ) {}

  public async storeFieldsInLocalStorage(field: Field) {
    try {
      const myFields = await this.getLocalStorageMyFields();
      if (myFields.length === 0) {
        myFields.push(field);
      } else {
        const existingFieldIndex = myFields.findIndex(
          (eachField) => eachField.id === field.id,
        );
        if (existingFieldIndex === -1) {
          myFields.push(field);
        } else {
          myFields[existingFieldIndex] = field;
        }
        myFields;
      }

      this.localStorage.set(FIELD_STORAGE_KEY, myFields);
    } catch (error) {
      throw new Error(
        'Error storing Field data: ' + (error.message ? error.message : error),
      );
    }
  }

  public async removeFieldFromLocalStorage(fieldId: string) {
    try {
      const myFields = await this.getLocalStorageMyFields();
      const existingFIeldIndex = myFields.findIndex(
        (eachCrop) => eachCrop.id === fieldId,
      );

      if (existingFIeldIndex !== -1) {
        myFields.splice(existingFIeldIndex, 1);
        this.localStorage.set(FIELD_STORAGE_KEY, myFields);
      }
    } catch (error) {
      throw new Error(
        'Error removing Field data: ' + (error.message ? error.message : error),
      );
    }
  }

  public getLocalStorageMyFields(): Promise<Field[]> {
    return Promise.resolve(
      this.localStorage.get(FIELD_STORAGE_KEY) || this.getEmptyMyFields(),
    );
  }

  public getFieldFromMyFieldById(id: string) {
    return this.localStorage
      .get(FIELD_STORAGE_KEY)
      .find((field) => field.id === id);
  }


  private getEmptyMyFields(): Field[] {
    const emptyArray: Field[] = [];
    return emptyArray;
  }
}
