import { Observable, Observer } from 'rxjs';
import { DataService } from './DataService';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { GeoLocationUtil } from '../utility/GeoLocationUtil';

const LOCATION = 'location';

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  constructor(
    private dataService: DataService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    private geolocationUtil: GeoLocationUtil
  ) {}

  public getLocationInfo(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      if (this.getLocationFromLocalStorage() === undefined) {
        this.geolocationUtil.getCurrentLocation().subscribe(
          (coordinates) => {
            this.dataService
              .getLocationData(coordinates)
              .subscribe((locationData) => {
                const location = locationData.data.location.city;
                this.storeLocationInLocalStorage(location);
                observer.next(location);
                observer.complete();
              });
          },
          (err) => {
            observer.error(
              'Error getting location data: ' +
                (err.message ? err.message : err)
            );
          }
        );
      } else {
        observer.next(this.getLocationFromLocalStorage());
        observer.complete();
      }
    });
  }

  public storeLocationInLocalStorage(location) {
    this.localStorage.set(LOCATION, location);
  }

  public getLocationFromLocalStorage() {
    return this.localStorage.get(LOCATION);
  }
}
