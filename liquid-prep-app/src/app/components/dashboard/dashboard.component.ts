import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherDataService } from '../../service/WeatherDataService';
import { TodayWeather } from '../../models/TodayWeather';
import { formatDate } from '@angular/common';
import { GeoLocationService } from 'src/app/service/GeoLocationService';
import { HeaderService } from 'src/app/service/header.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  public todayWeather: TodayWeather = null;
  public loading = true;
  public errorMessage = '';
  public precipChance;
  public precipitaion;
  public humidity;
  public uvIndex;
  public weatherIconImage;
  public temparature;
  public nextDayTemperatureMax;
  public nextDayTemperatureMin;
  public currentDate = '';
  public location;

  constructor(
    private router: Router,
    private weatherService: WeatherDataService,
    private geoLocationService: GeoLocationService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.updateWeatherInfo();
    this.getLocation();
    this.headerService.updateHeader(
      'Farm Dashboard',   // headerTitle
      'menu',       // leftIconName
      'volume_up',   // rightIconName
      undefined,  // leftBtnClick
      undefined,  // rightBtnClick
    );
  }

  public backClicked() {
    this.location.back();
  }

  onClick(card: string) {
    if (card === 'my-crops') {
      this.router.navigate(['my-crops']).then((r) => {});
    }else if(card === 'test-sensor'){
      this.router.navigate(['test-sensor']).then((r) => {});
    }
  }

  public onHeaderClick(data:string){
    if(data == 'leftBtn'){
      this.backClicked();
    }else {
      //TODO
    }
  }

  private updateWeatherInfo() {
    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
      (todayWeather: TodayWeather) => {
        this.loading = false;
        this.todayWeather = todayWeather;
        this.precipChance =
          todayWeather.dayTime.precipChance !== null
            ? todayWeather.dayTime.precipChance
            : todayWeather.nextDayTime.precipChance;
        this.precipitaion =
          todayWeather.dayTime.precipitaion !== null
            ? todayWeather.dayTime.precipitaion
            : todayWeather.nextDayTime.precipitaion;
        this.humidity =
          todayWeather.dayTime.humidity !== null
            ? todayWeather.dayTime.humidity
            : todayWeather.nextDayTime.humidity;
        this.uvIndex =
          todayWeather.dayTime.uvIndex !== null
            ? todayWeather.dayTime.uvIndex
            : todayWeather.nextDayTime.uvIndex;
        this.weatherIconImage =
          todayWeather.dayTime.iconImageUrl !== null
            ? todayWeather.dayTime.iconImageUrl
            : todayWeather.nextDayTime.iconImageUrl;
        this.temparature =
          todayWeather.dayTime.temperature !== null
            ? todayWeather.dayTime.temperature
            : todayWeather.nightTime.temperature;
        this.nextDayTemperatureMax = todayWeather.nextDayTime.temperatureMax;
        this.nextDayTemperatureMin = todayWeather.nextDayTime.temperatureMin;
        this.currentDate = formatDate(new Date(), 'MMMM d', 'en');
      },
      (err) => {
        this.loading = false;
        this.errorMessage = err;
        console.error('DashboardComponent updateWeatherInfo', err);
      }
    );
  }

  private getLocation() {
    this.geoLocationService.getLocationInfo().subscribe((locationData) => {
      this.location = locationData;
    });
  }

}
