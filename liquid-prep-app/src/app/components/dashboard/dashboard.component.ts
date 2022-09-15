import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {WeatherDataService} from '../../service/WeatherDataService';
import {TodayWeather} from '../../models/TodayWeather';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public todayWeather: TodayWeather = null;
  public loading = true;
  public errorMessage = '';
  public precipChance;
  public precipitaion;
  public humidity;
  public uvIndex;
  public weahtherIconImage;

  constructor(private router: Router, private location: Location, private weatherService: WeatherDataService) {
  }

  ngOnInit(): void {
    this.updateWeatherInfo();
  }

  onClick(card: string) {
    if (card === 'my-crops'){
      this.router.navigate(['my-crops']).then(r => {});
    }
  }

  private updateWeatherInfo(){
    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
      (todayWeather: TodayWeather) => {
        this.loading = false;
        this.todayWeather = todayWeather;
        this.precipChance = todayWeather.dayTime.precipChance !== null ? todayWeather.dayTime.precipChance: todayWeather.nextDayTime.precipChance;
        this.precipitaion = todayWeather.dayTime.precipitaion !== null ? todayWeather.dayTime.precipitaion: todayWeather.nextDayTime.precipitaion;
        this.humidity = todayWeather.dayTime.humidity !== null ? todayWeather.dayTime.humidity: todayWeather.nextDayTime.humidity;
        this.uvIndex = todayWeather.dayTime.uvIndex !== null ? todayWeather.dayTime.uvIndex: todayWeather.nextDayTime.uvIndex;
        this.weahtherIconImage = todayWeather.dayTime.iconImageUrl !== null ?todayWeather.dayTime.iconImageUrl : todayWeather.nextDayTime.iconImageUrl;
      },
      (err) => {
        this.loading = false;
        this.errorMessage = err ;
        console.log('DashboardComponent updateWeatherInfo',err);
      }
    );
  }
}
      