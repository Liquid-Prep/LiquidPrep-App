import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import { WaterAdviceService } from 'src/app/service/WaterAdviceService';
import {Crop} from '../../models/Crop';
import {CropDataService} from '../../service/CropDataService';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  public volumeClicked() {

  }

  public backClicked() {
    this.router.navigateByUrl('/my-crops').then(r => {});
  }

  onFabClicked() {
    this.router.navigate(['/measure-soil/' + this.crop.id]).then(r => {});
  }
}
