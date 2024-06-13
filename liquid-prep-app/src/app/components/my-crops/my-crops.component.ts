import {
  Component,
  OnInit,
  Input,
  ApplicationRef,
  NgZone,
} from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { formatDate, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { Crop } from '../../models/Crop';
import { WeatherDataService } from 'src/app/service/WeatherDataService';
import { WaterAdviceService } from 'src/app/service/WaterAdviceService';
import { TodayWeather } from 'src/app/models/TodayWeather';
import { CropDataService } from 'src/app/service/CropDataService';
import { DateTimeUtil } from 'src/app/utility/DateTimeUtil';
import { DeleteCropComponent } from '../delete-crop/delete-crop.component';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-my-crops',
  templateUrl: './my-crops.component.html',
  styleUrls: ['./my-crops.component.scss'],
})
export class MyCropsComponent implements OnInit {
  myCrops: Crop[];
  seedingDate: '';
  displayedColumns: string[] = ['EmptyColumnTitle'];

  tabs = ['My Crops', 'Settings'];
  activeTab = this.tabs[0];
  background: ThemePalette = undefined;
  seedDate = null;

  headerConfig: HeaderConfig = {
    headerTitle: 'My Crops',
    leftIconName: 'menu',
    rightIconName: 'search',
    leftBtnClick: null,
    rightBtnClick: null,
  };

  public currentDate = '';
  public weatherIconDay = '';
  public weatherIconNight = '';
  public loading = false;
  public temperatureMax = null;
  public temperatureMin = null;
  public todayWeather = null;
  public myCropStatus: 'no-crop' | 'crop-selected' = 'no-crop';
  public errorMessage = '';

  constructor(
    private router: Router,
    private location: Location,
    private weatherService: WeatherDataService,
    private cropDataService: CropDataService,
    public dialog: MatDialog,
    private headerService: HeaderService
  ) {
    this.updateWeatherInfo();
  }

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.cropDataService.getLocalStorageMyCrops().then((myCrops) => {
      this.myCrops = myCrops;
      if (this.myCrops.length > 0) {
        this.myCropStatus = 'crop-selected';
      }
    });

    // TODO: Add weather template
    /*this.dataService.getWeatherInfo().subscribe((weatherInfo: WeatherResponse) => {
      const todayWeather = WeatherService.getInstance().createTodayWeather(weatherInfo);
    });*/
  }

  public handleLeftClick(data: string) {
    this.backClicked();
  }

  public tabClicked(tab) {
    this.activeTab = tab;
    if (tab === tab[0]) {
      this.router.navigateByUrl('/my-crops').then((r) => {});
    } else {
      this.router.navigateByUrl('/settings').then((r) => {});
    }
  }

  public fabClicked() {
    this.router.navigateByUrl('/select-crop').then((r) => {});
  }

  public volumeClicked() {}

  public cropClicked(event) {
    this.router.navigate(['advice']).then((r) => {});
  }

  public backClicked() {
    this.location.back();
  }

  onContextMenu($event: MouseEvent, crop: Crop) {}

  onViewCropAdvice(crop: Crop) {
    this.cropDataService.storeSelectedCropIdInSession(crop.id);
    this.router.navigate(['insights/' + crop.id]).then((r) => {});
  }

  onRemoveCrop(crop: Crop) {
    this.cropDataService
      .removeCropFromLocalStorage(crop.id)
      .then((r) => window.location.reload());
  }

  onAdd1stCrop() {
    this.router.navigateByUrl('/select-crop').then((r) => {});
  }

  public onHeaderClick(data: string) {
    if (data == 'leftBtn') {
      this.backClicked();
    } else {
      //TODO
    }
  }

  updateWeatherInfo() {
    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
      (todayWeather: TodayWeather) => {
        this.loading = false;
        this.todayWeather = todayWeather;
      },
      (err) => {
        this.loading = false;
        this.errorMessage = err;
      }
    );
  }

  showError(msg) {
    alert(msg ? msg : this.errorMessage);
  }

  openDeleteCropDialog(crop: Crop): void {
    const dialogRef2: MatDialogRef<DeleteCropComponent> = this.dialog.open(
      DeleteCropComponent,
      {
        width: '80%',
        panelClass: 'delete-crop-dialog',
        data: crop,
      }
    );

    dialogRef2.componentInstance.onDelete.subscribe(() => {
      this.onRemoveCrop(crop);
    });
  }
}
