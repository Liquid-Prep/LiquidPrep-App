import {Component, Inject, OnInit} from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { GeoLocationService } from '../../../service/GeoLocationService';
import { TodayWeather } from '../../../models/TodayWeather';
import { formatDate } from '@angular/common';
import { WeatherDataService } from '../../../service/WeatherDataService';
import {Crop} from '../../../models/Crop';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {WaterConfirmDialogComponent} from './water-confirm-dialog.component';
import {DateTimeUtil} from '../../../utility/DateTimeUtil';
import {WaterAdviceService} from '../../../service/WaterAdviceService';
import {Field} from "../../../models/Field";
import {FieldDataService} from "../../../service/FieldDataService";

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
  public myFields: Field[]
  public needsWateringFields: Field[];
  public recentlyWateredFields: Field[];
  public nonRecentlyWateredFields: Field[];

  constructor(
    private waterAdviceService: WaterAdviceService,
    private weatherService: WeatherDataService,
    private headerService: HeaderService,
    private geoLocationService: GeoLocationService,
    private fieldDataService: FieldDataService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { crop: Crop }
  ) {}
  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.updateWeatherInfo();
    this.getLocation();
    this.fieldDataService.getLocalStorageMyFields()
      .then((fields: Field[]) => {
          this.myFields = fields;
          this.FilterWateredFields(this.myFields);
          this.FilterNeedsWaterField(this.nonRecentlyWateredFields)
      })
      .catch((error) => {
        console.error('Error loading fields:', error);
      });
  }

  private FilterWateredFields(MyFields: Field[]){
    this.recentlyWateredFields = [];
    this.nonRecentlyWateredFields=[];
    const now = new Date();
    const recentlyAgo = new Date(now.getTime() - RECENTLY * 60 * 60 * 1000);
    MyFields.forEach((item:Field)=>{
      const waterDate = new Date(item.crop.waterDate);
      if (waterDate >= recentlyAgo && waterDate <= now) {
        this.recentlyWateredFields.push(item);
      } else {
        this.nonRecentlyWateredFields.push(item);
      }
    })
  }

  private FilterNeedsWaterField(fields: Field[]){
    this.needsWateringFields = [];
    this.nonRecentlyWateredFields.forEach((item:Field)=>{
      this.waterAdviceService.getWaterAdviceByCrop(item.crop).subscribe(advice => {
        console.log('water advice:', item.crop.cropName, advice.wateringDecision, advice.waterRecommended);
        if (advice.wateringDecision !== 'None'){
          this.needsWateringFields.push(item);
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

  onWaterClick(field: Field) {
    const dialogRef = this.dialog.open(WaterConfirmDialogComponent, {
      width: '500px',
      panelClass: ['form-dialog'],
      data: { field },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        field.crop.waterDate = new DateTimeUtil().getTodayDate();
        this.fieldDataService.storeFieldsInLocalStorage(field).then(
          (r) => {
            console.log(`water ${field.crop.cropName} onConfirm water date ${field.crop.waterDate}`);
            this.needsWateringFields = this.needsWateringFields.filter(item => item !== field);
            this.recentlyWateredFields.push(field);
          },
          (e) => { console.error('save water data fail:', field.fieldName,field.crop.cropName, e); }
        );
      }
    });
  }

}
