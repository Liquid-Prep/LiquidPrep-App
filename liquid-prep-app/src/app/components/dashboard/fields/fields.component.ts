import { Component, OnInit } from '@angular/core';
import { WeatherDataService } from 'src/app/service/WeatherDataService';
import { GeoLocationService } from 'src/app/service/GeoLocationService';
import { TodayWeather } from 'src/app/models/TodayWeather';
import { DataService } from  'src/app/service/DataService';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  public location;
  public loading = false;
  public todayWeather = null;
  public errorMessage = '';

  public waterFields = null;
  public wateredFields = null;

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
    private dataService: DataService
  ) {}
  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.updateWeatherInfo();
    this.getLocation();
    this.getFieldData();
  }

  public onHeaderClick(data: string) {
    console.log(data);
    if (data == 'leftBtn') {
      this.backClicked();
    } else {
      // TODO
    }
  }

  public getFieldData() {
    this.waterFields = this.dataService.getFieldList(false);
    this.wateredFields = this.dataService.getFieldList(true);
  }

  onWaterClick() {
    //TODO
    console.log("Water Clicked")
  }

  public toggleSearch() {
    console.log("Searching");
  }

  public updateWeatherInfo(){
    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
        (todayWeather: TodayWeather) => {
          this.loading = false;
          this.todayWeather = todayWeather;
          console.log(this.todayWeather);
        },
        (err) => {
          this.loading = false;
          this.errorMessage = err ;
        }
    );
  }

  public backClicked() {
    this.location.back();
  }

  private getLocation() {
    this.geoLocationService.getLocationInfo().subscribe((locationData) => {
      this.location = locationData;
    });
  }

}
