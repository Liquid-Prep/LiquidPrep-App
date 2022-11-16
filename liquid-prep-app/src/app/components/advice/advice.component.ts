import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import { WaterAdviceService } from 'src/app/service/WaterAdviceService';
import {Crop} from '../../models/Crop';
import {CropDataService} from '../../service/CropDataService';

import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.scss']
})
export class AdviceComponent implements OnInit {

  crop: Crop;
  currentDate = '';
  waterRecommeded = undefined;
  wateringDecision = '';
  temperature = undefined;
  soilMoistureLevel = undefined;
  soilMoisturePercentage = undefined;
  plantingDays = undefined;
  stageNumber = undefined;
  rainfallPercentage: number = undefined;
  rainfallIndex: string = undefined;
  weatherIcon: string = null;

  adviceImg = undefined; // this.ADVICE_IMAGES[0];

  public soilMoistureColorClass = 'color-high';
  public soilMoistureIndexColorMap = new Map([
    ['LOW', 'color-low'],
    ['MEDIUM', 'color-medium'],
    ['HIGH', 'color-high']
  ]);

  public selectedLanguage = 'spanish';
  public text_pos: number[] = [];
  public text_to_trans: string[] = [];
  public translations: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router, private languageService: LanguageTranslatorService,
    private waterAdviceService: WaterAdviceService,
    private cropService: CropDataService
  ) {}

  ngOnInit(): void {
    const cropId = this.route.snapshot.paramMap.get('id');
    this.crop = this.cropService.getCropFromMyCropById(cropId);
    this.currentDate = 'Today, ' + formatDate(new Date(), 'MMMM d, yyyy', 'en');
    this.waterAdviceService.getWaterAdvice().subscribe( advice => {
      this.waterRecommeded = advice.stage.waterUse;
      this.wateringDecision = advice.wateringDecision;
      this.plantingDays = advice.stage.age;
      this.stageNumber = advice.stage.stageNumber;
      this.temperature = advice.temperature;
      this.soilMoistureLevel = advice.soilMoistureReading.soilMoistureIndex;
      this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(this.soilMoistureLevel);
      this.soilMoisturePercentage = advice.soilMoistureReading.soilMoisturePercentage;
      this.rainfallIndex = advice.rainfallIndex;
      this.rainfallPercentage = advice.rainfallPercentage;
      this.weatherIcon = advice.weatherIconTemp;
      this.adviceImg = advice.imageUrl;
    });
  }

  public translate() {
    
    var allInBody = document.getElementsByTagName('body')[0];
    var allElements = allInBody.getElementsByTagName('*');
    
    for (var i = 0; i < allElements.length; i++) {
      if (!allElements[i].innerHTML.includes("</") && allElements[i].innerHTML.length != 0) {
        this.text_pos.push(i);
        console.log(i + ": " + allElements[i].innerHTML);
        this.text_to_trans.push(allElements[i].innerHTML);
      }
    }
    this.languageService.getTranslation(this.text_to_trans, this.selectedLanguage).subscribe((response: any) => {
      
      for (i = 0; i < this.text_pos.length; i++) {
        
        setTimeout(() => {  console.log("waiting ..."); }, 1000);
        allElements[this.text_pos[i]].innerHTML = response.translations[i].translation;
        
      }
    });
    
  }

  public volumeClicked() {

  }

  public backClicked() {
    this.router.navigateByUrl('/my-crops').then(r => {});
  }

  onFabClicked() {
    this.router.navigate(['/measure-soil/' + this.crop.id]).then(r => {});
  }
}
