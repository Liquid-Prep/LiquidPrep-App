import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe, of, Observer } from 'rxjs';
import { WeatherMeasuringUnit } from '../utility/WeatherMeasuringUnit';
import { GeoLocationUtil } from '../utility/GeoLocationUtil';
import { WeatherResponse } from '../models/api/WeatherResponse';
import { CropListResponse } from '../models/api/CropListResponse';
import { LocationResponse } from '../models/api/LocationResponse';
import config from 'src/config.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private weatherAPIUrl = '/weather/data?';

  private cropsListAPIUrl = '/crop/list';

  private cropAPIUrl = '/crop/';

  private locationAPIUrl = '/location/data?';

  constructor(
    private http: HttpClient,
    private geoLocationUtil: GeoLocationUtil
  ) {}

  public getWeatherInfo(): Observable<WeatherResponse> {
    const self = this;
    return new Observable((observer: Observer<WeatherResponse>) => {
      const unit = WeatherMeasuringUnit.getInstance().getUnit();
      let coordinates;
      this.geoLocationUtil.getCurrentLocation().subscribe({
        next(location) {
          coordinates = location;
          const params = 'geoCode=' + coordinates + '&units=' + unit;
          const url = config.backendAPIEndpoint + self.weatherAPIUrl + params;
          self.http.get<WeatherResponse>(url).subscribe(
            (weatherData) => {
              if (
                weatherData.status === 'success' &&
                weatherData.statusCode === 200
              ) {
                observer.next(weatherData);
                observer.complete();
              } else {
                observer.error(weatherData.message);
              }
            },
            (err) => {
              observer.error(err.message);
            }
          );
        },
        error(err) {
          const msg = `Geolocation and weather data not found because \n${err.message}`;
          alert(msg);
        },
      });
    });
  }

  public getCropsList(): Observable<CropListResponse> {
    const self = this;
    return new Observable((observer: Observer<any>) => {
      const url = config.backendAPIEndpoint + self.cropsListAPIUrl;
      self.http.get<CropListResponse>(url).subscribe(
        (cropListData) => {
          if (
            cropListData.status === 'success' &&
            cropListData.statusCode === 200
          ) {
            observer.next(cropListData);
            observer.complete();
          } else {
            observer.error(cropListData.message);
          }
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public getCropInfo(id: string): Observable<any> {
    const self = this;
    return new Observable((observer: Observer<any>) => {
      const url = config.backendAPIEndpoint + self.cropAPIUrl + id;
      self.http.get<any>(url).subscribe(
        (cropData) => {
          if (cropData.status === 'success' && cropData.statusCode === 200) {
            observer.next(cropData);
            observer.complete();
          } else {
            observer.error(cropData.message);
          }
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public getLocationData(coordinates): Observable<any> {
    const self = this;
    return new Observable((observer) => {
      const params = 'geoCode=' + coordinates;
      const url = config.backendAPIEndpoint + self.locationAPIUrl + params;
      self.http.get<any>(url).subscribe(
        (locationData: LocationResponse) => {
          if (
            locationData.status === 'success' &&
            locationData.statusCode === 200
          ) {
            observer.next(locationData);
            observer.complete();
          } else {
            observer.error(locationData.message);
          }
        },
        (err) => {
          observer.error('caught error:' + err);
        }
      );
    });
  }
}
