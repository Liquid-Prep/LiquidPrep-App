import {Component, OnInit, Input, ApplicationRef, NgZone} from '@angular/core';
import { formatDate, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';

import { Crop } from '../../models/Crop';
import { WeatherDataService } from 'src/app/service/WeatherDataService';
import { TodayWeather } from 'src/app/models/TodayWeather';
import { CropDataService } from 'src/app/service/CropDataService';
import { DateTimeUtil } from 'src/app/utility/DateTimeUtil';

import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'app-my-crops',
  templateUrl: './my-crops.component.html',
  styleUrls: ['./my-crops.component.scss'],
})
export class MyCropsComponent implements OnInit {
  myCrops: Crop[];
  displayedColumns: string[] = ['EmptyColumnTitle'];

  tabs = ['My Crops', 'Settings'];
  activeTab = this.tabs[0];
  background: ThemePalette = undefined;

  public currentDate = '';
  public weatherIconDay = '';
  public weatherIconNight = '';
  public loading = false;
  public temperatureMax = null;
  public temperatureMin = null;
  public todayWeather = null;
  public myCropStatus: 'no-crop' | 'crop-selected' = 'no-crop';
  public errorMessage = '';

  public selectedLanguage = 'en-ko';
  public text_pos: number[] = [];
  public text_to_trans: string[] = [];
  public translations: string[] = [];

  constructor(
    private router: Router, private location: Location, private languageService: LanguageTranslatorService,
    private weatherService: WeatherDataService, private cropDataService: CropDataService
    ) {
    this.updateWeatherInfo();
  }

  ngOnInit(): void {

    this.cropDataService.getMyCrops().subscribe(myCrops => {
      this.myCrops = myCrops;
      if (this.myCrops.length > 0){
        this.myCropStatus = 'crop-selected';
      }
    });

    this.currentDate =  formatDate(new Date(), 'MMMM d, yyyy', 'en');

    // TODO: Add weather template
    /*this.dataService.getWeatherInfo().subscribe((weatherInfo: WeatherResponse) => {
      const todayWeather = WeatherService.getInstance().createTodayWeather(weatherInfo);
    });*/
  }

  public translate(modelID) {
    
    var allInBody = document.getElementsByTagName('body')[0];
    var allElements = allInBody.getElementsByTagName('*');
    
    for (var i = 0; i < allElements.length; i++) {
      if (!allElements[i].innerHTML.includes("</") && allElements[i].innerHTML.length != 0) {
        this.text_pos.push(i);
        console.log(i + ": " + allElements[i].innerHTML);
        this.text_to_trans.push(allElements[i].innerHTML);
      }
    }
    this.languageService.getTranslation(this.text_to_trans, modelID).subscribe((response: any) => {
      
      for (i = 0; i < this.text_pos.length; i++) {
        
        setTimeout(() => {  console.log("waiting ..."); }, 1000);
        allElements[this.text_pos[i]].innerHTML = response.translations[i].translation;
        
      }
    });
    
  }

  public tabClicked(tab) {
    this.activeTab = tab;
    if (tab === tab[0]) {
      this.router.navigateByUrl('/my-crops').then(r => {});
    } else {
      this.router.navigateByUrl('/settings').then(r => {});
    }
  }

  public fabClicked() {
    this.router.navigateByUrl('/select-crop').then(r => {});
  }

  public volumeClicked() {

  }

  public cropClicked(event){
    this.router.navigate(['advice']).then(r => {});
  }

  public backClicked() {
    this.location.back();
  }

  onContextMenu($event: MouseEvent, crop: Crop) {
  }

  onViewCropAdvice(crop: Crop) {
    this.cropDataService.storeSelectedCropIdInSession(crop.id);
    this.router.navigate(['advice/' + crop.id]).then(r => {});
  }

  onRemoveCrop(crop: Crop) {
    this.cropDataService.deleteMyCrop(crop.id);
    window.location.reload();
  }

  onAdd1stCrop() {
    this.router.navigateByUrl('/select-crop').then(r => {});
  }

  updateWeatherInfo(){

    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
        (todayWeather: TodayWeather) => {
          this.loading = false;
          this.todayWeather = todayWeather;
        },
        (err) => {
          this.loading = false;
          this.errorMessage = err ;
        }
    );
  }

  showError(msg) {
    alert(msg ? msg : this.errorMessage);
  }

}
