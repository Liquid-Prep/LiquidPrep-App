import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WaterAdviceService } from 'src/app/service/WaterAdviceService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Crop } from '../../models/Crop';
import { CropDataService } from '../../service/CropDataService';
import { CropStaticInfo } from '../../models/CropStatic';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MoistureLogsComponent } from './moisture-logs/moisture-logs.component';
import { SENSORS_MOCK_DATA } from 'src/app/components/dashboard/sensors/sensor-data';

@Component({
  selector: 'app-watering-insigts',
  templateUrl: './watering-insights.component.html',
  styleUrls: ['./watering-insights.component.scss'],
})
export class WateringInsightsComponent implements OnInit {
  crop: Crop;
  cropStatic: CropStaticInfo;
  currentDate = '';
  seedDate = '';
  advice;
  percentageValues = 50;
  dynamicImageUrl: String;
  moistureImageUrl: String;
  lastMeasuredDate;
  lastWateredDate;
  sensor = SENSORS_MOCK_DATA[0];
  watered: boolean = false;

  headerConfig: HeaderConfig = {
    headerTitle: 'Watering Insights',
    leftIconName: 'arrow_back',
    rightIconName: 'cached',
    leftBtnClick: this.backClicked.bind(this),
    rightBtnClick: this.refreshpage.bind(this),
  };

  private datePipe: DatePipe = new DatePipe('en-US');

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private router: Router,
    private waterAdviceService: WaterAdviceService,
    private cropService: CropDataService,
    private _snackBar: MatSnackBar,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    const cropId = this.route.snapshot.paramMap.get('id');
    this.route.data.subscribe((data: { cropStaticInfo: CropStaticInfo }) => {
      this.cropStatic = data.cropStaticInfo;
    });
    this.crop = this.cropService.getCropFromMyCropById(cropId);
    this.currentDate = this.datePipe.transform(new Date(), 'MM/dd/yy');
    this.lastWateredDate = this.datePipe.transform(
      new Date('2022-03-25'),
      'mediumDate'
    );
    this.seedDate = this.datePipe.transform(this.crop.seedingDate, 'MM/dd/yy');
    this.waterAdviceService.getWaterAdvice().subscribe((advice) => {
      this.advice = advice;
      this.moistureImageUrl = advice.imageUrl;
      this.percentageValues = this.sensor.moistureLevel;
    });
    this.dynamicImageUrl = this.getCropPhoto(this.crop.cropName);
    this.lastMeasuredDate = this.formatUnixTimestamp(
      this.sensor.lastUpdatedTime
    );
  }

  openFullViewDialog(): void {
    const dialogRef = this.dialog.open(MoistureLogsComponent, {
      maxWidth: '100vw',
      width: '100%', // Set the width to 100%
      height: '90%',
      data: {
        sensorId: this.sensor.id,
        fieldName: this.sensor.fieldLocation,
        cropType: this.crop.cropName,
      },
    });
  }

  public getCropPhoto(type: string) {
    if (type === 'Corn') {
      return 'assets/crops-images/corn-harvest-rect.png';
    } else if (type === 'Wheat') {
      return 'assets/crops-images/wheat-harvest-rect.png';
    } else if (type === 'Cotton') {
      return 'assets/crops-images/cotton-harvest-rect.png';
    } else if (type === 'Soybean') {
      return 'assets/crops-images/soybean-harvest-rect.png';
    } else if (type === 'Sorghum') {
      return 'assets/crops-images/sorghum-harvest-rect.png';
    } else {
      return 'assets/crops-images/missing.jpg';
    }
  }

  formatUnixTimestamp(timestamp, forFilter = false) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    if (forFilter) {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        year: 'numeric',
      });
    }
  }

  public backClicked() {
    this.location.back();
  }

  markAsWatered() {
    this.watered = true;
    // TODO: Function About Watering in API
    this.lastWateredDate = this.datePipe.transform(new Date(), 'mediumDate');
  }

  refreshpage() {
    this._snackBar.open('Refreshing...', 'Ok', {
      duration: 5000,
    });
  }

  viewHistory() {
    //TODO History Page
    this._snackBar.open('No History for now', 'Ok', {
      duration: 5000,
    });
  }
}
