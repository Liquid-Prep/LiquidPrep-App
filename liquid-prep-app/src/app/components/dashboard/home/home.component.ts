import {Component, Inject, OnInit} from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { GeoLocationService } from '../../../service/GeoLocationService';
import { TodayWeather } from '../../../models/TodayWeather';
import { formatDate } from '@angular/common';
import { WeatherDataService } from '../../../service/WeatherDataService';
import {Crop} from '../../../models/Crop';
import {CropDataService} from '../../../service/CropDataService';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {WaterConfirmDialogComponent} from './water-confirm-dialog.component';
import {DateTimeUtil} from '../../../utility/DateTimeUtil';
import {WaterAdviceService} from '../../../service/WaterAdviceService';

const RECENTLY = 48;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  headerConfig: HeaderConfig = {
    headerTitle: 'Liquid Prep',
    leftIconName: 'menu',
    rightIconName: 'cached',
    leftBtnClick: null,
    rightBtnClick: null,
  };

  public todayWeather: TodayWeather = null;
  public loading = true;
  public errorMessage = '';
  public precipChance: number;
  public precipitaion: number;
  public precipType: string;
  public humidity: number;
  public uvIndex: number;
  public weatherIconImage: string;
  public temperature: number;
  public nextDayTemperatureMax: number;
  public nextDayTemperatureMin: number;
  public currentDate = '';
  public location: string;
  public myCrops: Crop[];
  public needsWateringCrops: Crop[];
  public recentlyWateredCrops: Crop[];
  public nonRecentlyWateredCrops: Crop[];
  public myCropStatus: 'no-crop' | 'crop-selected' = 'no-crop';

  constructor(
    private waterAdviceService: WaterAdviceService,
    private weatherService: WeatherDataService,
    private headerService: HeaderService,
    private geoLocationService: GeoLocationService,
    private cropDataService: CropDataService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { crop: Crop }
  ) {}
  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.updateWeatherInfo();
    this.getLocation();
    this.cropDataService.getLocalStorageMyCrops().then(
      (myCrops) => {
        this.myCrops = myCrops;
        if (this.myCrops.length > 0){
          this.myCropStatus = 'crop-selected';
          this.FilterWateredCrops(this.myCrops);
          this.FilterNeedsWaterCrop(this.nonRecentlyWateredCrops);
        }
      }
    );
  }

  private FilterWateredCrops(myCrops: Crop[]){
    this.recentlyWateredCrops = [];
    this.nonRecentlyWateredCrops = [];
    const now = new Date();
    const recentlyAgo = new Date(now.getTime() - RECENTLY * 60 * 60 * 1000);
    myCrops.forEach((cropItem) => {
      const waterDate = new Date(cropItem.waterDate);
      if (waterDate >= recentlyAgo && waterDate <= now) {
        this.recentlyWateredCrops.push(cropItem);
      } else {
        this.nonRecentlyWateredCrops.push(cropItem);
      }
    });
  }

  private FilterNeedsWaterCrop(crops: Crop[]){
    this.needsWateringCrops = [];
    this.nonRecentlyWateredCrops.forEach((item) => {
      this.waterAdviceService.getWaterAdviceByCrop(item).subscribe(advice => {
        console.log('water advice:', item.cropName, advice.wateringDecision, advice.waterRecommended);
        if (advice.wateringDecision !== 'None'){
          this.needsWateringCrops.push(item);
        }
      });
    });
  }

  onTabChange(event: MatTabChangeEvent) {
  }

  private getLocation() {
    this.geoLocationService.getLocationInfo().subscribe((locationData) => {
      this.location = locationData;
    });
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
        this.precipType =
          todayWeather.dayTime.precipType !== null
            ? todayWeather.dayTime.precipType
            : todayWeather.nextDayTime.precipType;
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
        this.temperature =
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

  onWaterClick(crop: Crop) {
    const dialogRef = this.dialog.open(WaterConfirmDialogComponent, {
      width: '500px',
      panelClass: ['form-dialog'],
      data: { crop },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        crop.waterDate = new DateTimeUtil().getTodayDate();
        this.cropDataService.storeMyCropsInLocalStorage(crop).then(
          (r) => {
            console.log(`water ${crop.cropName} onConfirm water date ${crop.waterDate}`);
            this.needsWateringCrops = this.needsWateringCrops.filter(item => item !== crop);
            this.recentlyWateredCrops.push(crop);
          },
          (e) => { console.error('save water data fail:', crop.cropName, e); }
        );
      }
    });
  }
}
