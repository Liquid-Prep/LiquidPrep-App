import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoLocationUtil {
  private latitude: number;
  private longitude: number;

  public getCurrentLocation(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      let coordinates;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Successful getCurrentPosition
            if (position) {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;

              coordinates =
                this.latitude.toFixed(4) + ',' + this.longitude.toFixed(4);
              observer.next(coordinates);
              observer.complete();
            } else {
              throw Error('Geo coordinates are undefined.');
            }
          },
          (error) => {
            // Error with getCurrentPosition
            observer.error(error);
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });
  }
}
