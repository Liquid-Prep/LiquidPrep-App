import { Component, OnInit } from '@angular/core';
import { WeatherDataService } from 'src/app/service/WeatherDataService';
import { GeoLocationService } from 'src/app/service/GeoLocationService';
import { TodayWeather } from 'src/app/models/TodayWeather';
import { DataService } from 'src/app/service/DataService';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
})
export class FieldsComponent implements OnInit {
  public location;
  public loading = false;
  public todayWeather = null;
  public errorMessage = '';

  public waterFields = null;
  public wateredFields = null;

  public name = null;
  public id = null;

  headerConfig: HeaderConfig = {
    headerTitle: 'Fields',
    leftIconName: 'menu',
    rightIconName: 'search',
    leftBtnClick: null,
    rightBtnClick: this.toggleSearch.bind(this),
  };

  constructor(
    private headerService: HeaderService,
    private weatherService: WeatherDataService,
    private geoLocationService: GeoLocationService,
    private dataService: DataService,
    private dialog: MatDialog,
  ) {}
  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.updateWeatherInfo();
    this.getLocation();
    this.getFieldData();
  }

  public onHeaderClick(data: string) {
    if (data == 'leftBtn') {
      this.backClicked();
    } else {
      // TODO
    }
  }

  public getPlantImage(type: String) {
    if (type == 'Corn') {
      return 'assets/crops-images/corn.png';
    } else if (type == 'Cotton') {
      return 'assets/crops-images/cotton.png';
    } else if (type == 'Soybean') {
      return 'assets/crops-images/soybean.png';
    } else if (type == 'Wheat') {
      return 'assets/crops-images/wheat.png';
    } else if (type == 'Sorghum') {
      return 'assets/crops-images/sorghum.png';
    } else {
      return 'assets/crops-images/missing.png';
    }
  }

  public getWeatherIconImage(url: String) {
    if (url.includes('Thunderstorm')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Thunderstorm.svg';
    } else if (url.includes('Cloudy')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Cloudy.svg';
    } else if (url.includes('Rainy')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Rain-Hail.svg';
    } else if (url.includes('Sprinkle')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Rain-Hail.svg';
    } else if (url.includes('Snow')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Snow-Sleet.svg';
    } else if (url.includes('Hail')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Rain-Hail.svg';
    } else if (url.includes('Sleet')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Snow-Sleet.svg';
    } else if (url.includes('Fog')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Cloudy.svg';
    } else if (url.includes('Sun' || 'Partly_sunny' || 'Sunny')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Sunny.svg';
    } else if (url.includes('Storm')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Thunderstorm.svg';
    } else if (url.includes('Showers')) {
      return 'assets/icons/dashboard-icons/WeatherIcon_Rain-Hail.svg';
    } else {
      return 'assets/icons/dashboard-icons/WeatherIcon_Cloudy.svg';
    }
  }

  public getFieldData() {
    this.waterFields = this.dataService.getFieldList(false);
    this.wateredFields = this.dataService.getFieldList(true);
    console.log(this.waterFields.length);
  }

  onWaterClick(id: String, name: String, dialog: any) {
    this.name = name;
    this.id = id;
    console.log(this.id);
    this.dialog.open(dialog, { width: '500px', panelClass: ['form-dialog'] });
  }

  public toggleSearch() {
    console.log('Searching');
  }

  public updateWeatherInfo() {
    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
      (todayWeather: TodayWeather) => {
        this.loading = false;
        this.todayWeather = todayWeather;
        console.log(this.todayWeather);
      },
      (err) => {
        this.loading = false;
        this.errorMessage = err;
      },
    );
  }

  public backClicked() {
    this.location.back();
  }

  public onClose() {
    console.log('close');
  }

  public onConfirm() {
    console.log('confirm');
  }

  private getLocation() {
    this.geoLocationService.getLocationInfo().subscribe((locationData) => {
      this.location = locationData;
    });
  }
}
