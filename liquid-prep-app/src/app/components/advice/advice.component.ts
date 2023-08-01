import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';

import { WaterAdviceService } from 'src/app/service/WaterAdviceService';
import { Crop } from '../../models/Crop';
import { CropDataService } from '../../service/CropDataService';
import { CropStaticInfo } from '../../models/CropStatic';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.scss']
})
export class AdviceComponent implements OnInit {

  crop: Crop;
  cropStatic: CropStaticInfo;
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
  cropImage: string = null;

  adviceImg = undefined; // this.ADVICE_IMAGES[0];

  public soilMoistureColorClass = 'color-high';
  public soilMoistureIndexColorMap = new Map([
    ['LOW', 'color-low'],
    ['MEDIUM', 'color-medium'],
    ['HIGH', 'color-high']
  ]);

  private datePipe: DatePipe = new DatePipe('en-US');


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private waterAdviceService: WaterAdviceService,
    private cropService: CropDataService
  ) {}

  ngOnInit(): void {
    const cropId = this.route.snapshot.paramMap.get('id');
    // this.cropService.getCropStaticInfoById(cropId).then(cropStaticInfo => {
    //     this.cropStatic = cropStaticInfo;
    //   });
    this.route.data.subscribe((data: { cropStaticInfo: CropStaticInfo }) => {
      this.cropStatic = data.cropStaticInfo;
    });
    this.crop = this.cropService.getCropFromMyCropById(cropId);
    this.currentDate = this.datePipe.transform(new Date(), 'MM/dd/yy');
    this.waterAdviceService.getWaterAdvice().subscribe( advice => {
      this.waterRecommeded = advice.stage.waterUse;
      this.wateringDecision = advice.wateringDecision;
      this.plantingDays = this.cropService.getPlantingDays(this.crop);
      this.stageNumber = advice.stage.stageNumber;
      this.temperature = advice.temperature;
      this.soilMoistureLevel = advice.soilMoistureReading.soilMoistureIndex;
      this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(this.soilMoistureLevel);
      this.soilMoisturePercentage = advice.soilMoistureReading.soilMoisturePercentage;
      this.rainfallIndex = advice.rainfallIndex;
      this.rainfallPercentage = advice.rainfallPercentage;
      this.weatherIcon = advice.weatherIconTemp;
      this.adviceImg = advice.imageUrl;
      console.log('adviceImg:', this.adviceImg);
    });
  }

  public volumeClicked() {

  }

  public backClicked() {
    this.router.navigateByUrl('/my-crops').then(r => {});
  }

  onMeasureClicked() {
    this.cropService.setCrop(this.crop);
    this.router.navigate(['/measure-soil/' + this.crop.id]).then(r => {});
  }

  onPastReadingClicked() {
    this.router.navigate(['/past-readings/']).then(r => {});
  }

}
