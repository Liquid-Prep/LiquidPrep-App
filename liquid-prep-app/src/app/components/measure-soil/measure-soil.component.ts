import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-swiper-wrapper';
import { SoilMoistureService } from '../../service/SoilMoistureService';
import { SoilMoisture } from '../../models/SoilMoisture';
import { LineBreakTransformer } from './LineBreakTransformer';
import { Crop, Stage } from '../../models/Crop';
import { CropDataService } from '../../service/CropDataService';
import {SensorService} from '../../service/sensor.service';

@Component({
  selector: 'app-measure-soil',
  templateUrl: './measure-soil.component.html',
  styleUrls: ['./measure-soil.component.scss'],
})
export class MeasureSoilComponent implements OnInit, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private soilService: SoilMoistureService,
    private cropService: CropDataService,
    private sensorService: SensorService
  ) {}

  public config: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: false,
      hideOnClick: false,
    },
    longSwipesRatio: 0.1,
    longSwipesMs: 100,
    threshold: 5,
  };

  @ViewChild(SwiperComponent, { static: false }) swiper?: SwiperComponent;

  public crop: Crop;
  public stage: Stage;
  public curIndex = 0;
  public isFirstSlide = true;
  public isLastSlide = false;
  public disabled = false;
  public countdownSecond = 5;
  public measureView: 'before-measuring' | 'measuring' | 'after-measuring' = 'before-measuring';
  private interval;
  public soilData: SoilMoisture;

  private lastConnection: 'ble' | 'wifi';
  public soilMoistureColorClass = 'color-high';
  public soilMoistureIndexColorMap = new Map([
    ['LOW', 'color-low'],
    ['MEDIUM', 'color-medium'],
    ['HIGH', 'color-high'],
  ]);
  public moistureIcon = undefined;
  public soilMoistureIconMap = new Map([
    ['LOW', '/assets/moisture-water/soil_moisture_low.png'],
    ['MEDIUM', '/assets/moisture-water/soil_moisture_medium.png'],
    ['HIGH', '/assets/moisture-water/soil_moisture_high.png'],
  ]);

  ngOnInit(): void {
    const cropId = this.route.snapshot.paramMap.get('id');
    this.crop = this.cropService.getCropFromMyCropById(cropId);
    this.stage = this.cropService.generateCropGrowthStage(this.crop);
  }

  ngAfterViewInit(): void {}

  public onSensorConnect(connectionOption) {
    this.lastConnection = connectionOption;
    if (connectionOption === 'wifi') {
      this.sensorService.readFromWifi().then(
        resolve => {
          const soilMoisture = this.sensorValueLimitCorrection(resolve);
          this.soilService.setSoilMoistureReading(soilMoisture);
          this.setMeasureView('measuring');
          this.readingCountdown();
        },
        reject => {
          window.alert('Failed to connect to sensor via Wifi');
          console.log('onSensorConnect wifi: ', reject);
        }
      );
    } else if (connectionOption === 'ble') {
      this.sensorService.readFromBle().then(
        resolve => {
        const soilMoisture = this.sensorValueLimitCorrection(resolve);
        this.soilService.setSoilMoistureReading(soilMoisture);
        this.setMeasureView('measuring');
        this.readingCountdown();
      },
        reject => {
        window.alert('Failed to connect to sensor via Bluetooth');
        console.log('onTest bluetooth: ', reject);
      });
    } else {
      alert('Please choose one soil sensor connection option.');
    }
  }

  private sensorValueLimitCorrection(sensorMoisturePercantage: number) {
    if (sensorMoisturePercantage >= 100.0) {
      return 99;
    } else if (sensorMoisturePercantage < 0.0) {
      return 0.0;
    } else {
      return sensorMoisturePercantage;
    }
  }

  public onIndexChange(index: number): void {
    this.curIndex = index;
    if (index === 0) {
      this.isFirstSlide = true;
      this.isLastSlide = false;
    } else if (index === 2) {
      this.isFirstSlide = false;
      this.isLastSlide = true;
    } else {
      this.isFirstSlide = false;
      this.isLastSlide = false;
    }
  }

  public onSwiperEvent(event: string): void {}

  public volumeClicked() {}

  public backClicked() {
    this.clearCountdown();
    if (this.measureView === 'before-measuring') {
      this.location.back();
    } else {
      this.measureView = 'before-measuring';
    }
  }

  public onHeaderClick(data: string){
    if (data === 'leftBtn'){
      this.backClicked();
    }else {
      this.volumeClicked();
    }
  }

  public readingCountdown() {
    // this.countdownSecond = seconds;
    this.interval = setInterval(() => {
      if (this.countdownSecond <= 0) {
        this.setMeasureView('after-measuring');
        clearInterval(this.interval);
        this.soilData = this.soilService.getSoilMoistureReading();
        if (!this.soilData.soilMoisturePercentage) {
          this.soilData.soilMoisturePercentage =
            Math.floor(Math.random() * 100) + 0;
        }
        this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(
          this.soilData.soilMoistureIndex
        );
        this.moistureIcon = this.soilMoistureIconMap.get(
          this.soilData.soilMoistureIndex
        );
        this.countdownSecond = 5;
      }
      this.countdownSecond--;
    }, 1000);
  }

  private clearCountdown() {
    clearInterval(this.interval);
  }

  public setMeasureView(
    status: 'before-measuring' | 'measuring' | 'after-measuring'
  ) {
    this.measureView = status;
  }

  onGetAdvise() {
    this.router.navigate(['advice/' + this.crop.id]).then((r) => {});
  }

  onMeasure() {
    this.onSensorConnect(this.lastConnection);
  }

  onSlideNav(direction: string) {
    if (direction === 'next') {
      this.swiper.directiveRef.nextSlide(200);
    } else {
      this.swiper.directiveRef.prevSlide(200);
    }
  }
}
