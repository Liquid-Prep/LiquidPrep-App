import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { WaterAdviceService } from 'src/app/service/WaterAdviceService';
import { Crop } from '../../models/Crop';
import { CropDataService } from '../../service/CropDataService';
import { CropStaticInfo } from '../../models/CropStatic';
import { DatePipe } from '@angular/common';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.scss']
})
export class AdviceComponent implements OnInit {

  headerConfig: HeaderConfig = {
    headerTitle: 'Watering Insights',
    leftIconName: 'menu',
    rightIconName: 'arrow_back',
    rightBtnClick: this.backClicked.bind(this),
    leftBtnClick: null,
  };

  crop: Crop;
  cropStatic: CropStaticInfo;
  currentDate = '';
  waterRecommeded = undefined;
  wateringDecision = '';
  temperature = undefined;
  soilMoistureLevel = undefined;
  soilMoisturePercentage = undefined;
  seedingDate = undefined;
  plantingDays = undefined;
  stage = undefined;
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
    private cropService: CropDataService,
    private headerService: HeaderService,
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);

    const cropId = this.route.snapshot.paramMap.get('id');
    // this.cropService.getCropStaticInfoById(cropId).then(cropStaticInfo => {
    //     this.cropStatic = cropStaticInfo;
    //   });
    this.route.data.subscribe((data: { cropStaticInfo: CropStaticInfo }) => {
      this.cropStatic = data.cropStaticInfo;
      console.log("CROP STATITC");
      console.log(this.cropStatic);
    });
    this.crop = this.cropService.getCropFromMyCropById(cropId);
    console.log("CROP");
    console.log(this.crop);
    this.seedingDate = this.crop.seedingDate;
    this.seedingDate = this.datePipe.transform(new Date(), 'MM/dd/yy');
    this.currentDate = this.datePipe.transform(new Date(), 'MM/dd/yy');
    this.waterAdviceService.getWaterAdvice().subscribe( advice => {
      console.log("ADVICE");
      console.log(advice);
      this.waterRecommeded = advice.stage.waterUse;
      this.wateringDecision = advice.wateringDecision;
      this.plantingDays = this.cropService.getPlantingDays(this.crop);
      this.stage = advice.stage.stage;
      this.stageNumber = advice.stage.stageNumber;
      this.temperature = advice.temperature;
      this.soilMoistureLevel = advice.soilMoistureReading.soilMoistureIndex;
      this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(this.soilMoistureLevel);
      this.soilMoisturePercentage = advice.soilMoistureReading.soilMoisturePercentage || 0;
      this.rainfallIndex = advice.rainfallIndex;
      this.rainfallPercentage = advice.rainfallPercentage;
      this.weatherIcon = advice.weatherIconTemp;
      this.adviceImg = advice.imageUrl;
      console.log('adviceImg:', this.adviceImg);
    });

  }

  public volumeClicked() {

  }

  public onHeaderClick(data:string){
    if(data == 'leftBtn'){
      this.backClicked();
    }else {
      //TODO
    }
  }

  public handleLeftClick(data: string){
    this.backClicked();
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
