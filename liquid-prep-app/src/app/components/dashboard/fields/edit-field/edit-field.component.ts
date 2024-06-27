import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldDataService } from 'src/app/service/FieldDataService';
import { Guid } from 'guid-typescript';
import { SENSORS_MOCK_DATA } from './../../sensors/sensor-data';
import { Field } from 'src/app/models/Field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SensorListComponent } from './../sensor-list/sensor-list.component';
import { CropDataService } from 'src/app/service/CropDataService';
import { Subject, forkJoin, from } from 'rxjs';
import { CropInfoResp } from '../../../../models/api/CropInfoResp';
import { SensorV2Service } from 'src/app/service/sensor-v2.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss'],
})
export class EditFieldComponent implements OnInit {
  destroyed$ = new Subject<void>();
  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  headerConfig: HeaderConfig = {
    headerTitle: 'Edit Field',
    leftIconName: 'arrow_back',
    rightIconName: 'save',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: this.save.bind(this),
  };
  id: string;
  fieldForm: FormGroup;
  fieldDetails: any;
  sensorsData = SENSORS_MOCK_DATA;
  sensors: any[] = [];
  cropsList;
  cropValue;
  progress: boolean = false;

  sensorActions: any = {};

  constructor(
    private headerService: HeaderService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private fieldService: FieldDataService,
    private cropService: CropDataService,
    private sensorV2Service: SensorV2Service,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.loadForm();
    this.loadCropData();
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.getFieldDetails(this.id);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  loadForm() {
    this.fieldForm = new FormGroup({
      fieldName: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      crop: new FormControl(null, [Validators.required]),
      plantDate: new FormControl(null, [Validators.required]),
      cropSelect: new FormControl(),
      soilType: new FormControl(null, [Validators.required]),
    });
    const cropForm = this.fieldForm.get('crop');
    cropForm.disable();
  }

  loadCropData() {
    this.progress = true;
    const cropForm = this.fieldForm.get('crop');
    forkJoin({
      cropsListData: this.cropService.getCropListFromApi(),
      myCrops: from(this.cropService.getLocalStorageMyCrops()),
    }).subscribe(
      (results) => {
        const cropsListData = results.cropsListData;
        this.cropsList = cropsListData;
        cropForm.enable();
        this.progress = false;
      },
      (error) => {
        alert('Could not get crop list: ' + error);
        cropForm.enable();
        this.progress = false;
      }
    );
  }

  public handleLeftClick(data: string) {
    if (!this.fieldForm.dirty) {
      this.openDialog(this.dialogTemplate);
    } else {
      this.location.back();
    }
  }

  openDialog(dialogTemplate: TemplateRef<any>): void {
    this.dialog.open(dialogTemplate, {
      height: '300px',
      width: '400px',
    });
  }

  openCropDialog(dialogTemplate: TemplateRef<any>): void {
    this.dialog.open(dialogTemplate, {
      height: '430px',
      width: '400px',
    });
  }

  clickCropNext() {
    this.cropService.getCropInfo(this.cropValue.id).subscribe(
      (resp: CropInfoResp) => {
        this.cropValue.id = resp.data.docs[0]._id;
        this.cropValue.cropName = resp.data.docs[0].cropName;
        this.cropValue.facts = resp.data.docs[0];
      },
      (error) => {
        alert('clickCropNext Could not get crop info: ' + error);
        console.error('clickCropNext Error getting CropInfo:', error);
      }
    );
    this.fieldForm.patchValue({
      crop: this.fieldForm.get('cropSelect').value.cropName,
    });
    this.cropValue = this.fieldForm.get('cropSelect').value;
  }

  backedClicked() {
    this.location.back();
  }

  public patchFieldValue() {
    this.fieldForm.patchValue({
      fieldName: this.fieldDetails.fieldName,
      description: this.fieldDetails.description,
      crop: this.fieldDetails.crop.type,
      plantDate: this.fieldDetails.plantDate,
      soilType: this.fieldDetails.soil,
    });
    this.cropValue = this.fieldDetails.crop;
  }

  public async getFieldDetails(id: string) {
    this.fieldDetails = await this.fieldService.getFieldFromMyFieldById(id);
    this.sensorV2Service
      .fetchSensorsByFieldId(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (sensors) => {
          this.sensors = sensors;
          this.sensors.forEach((sensor) => {
            this.sensorActions[sensor.mac] = {
              action: 'assigned',
              sensor,
            };
          });
        },
      });
    this.patchFieldValue();
  }

  public openFullViewDialog(): void {
    const dialogRef = this.dialog.open(SensorListComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.sensorActions[result.mac]) {
          this.sensors.push(result);
          this.sensorActions[result.mac] = {
            action: 'added',
            sensor: result,
          };
        } else if (this.sensorActions[result.mac].action === 'removed') {
          this.sensors.push(result);
          this.sensorActions[result.mac] = {
            action: 'assigned',
            sensor: result,
          };
        }
      }
    });
  }

  public removeSensor(macAddress) {
    if (this.sensorActions[macAddress]?.action === 'assigned') {
      this.sensorActions[macAddress].action = 'removed';
    } else if (this.sensorActions[macAddress]?.action === 'added') {
      delete this.sensorActions[macAddress];
    }
    const index = this.sensors.indexOf((sensor) => sensor.mac === macAddress);
    this.sensors.splice(index, 1);
  }

  public save() {
    console.log(this.sensorActions);
    if (!this.fieldForm.valid) {
      this._snackBar.open('Please Fill up the Form', 'Ok', {
        duration: 3000,
      });
      return;
    }

    let formattedDate, description;
    const name = this.fieldForm.get('fieldName').value;
    if (this.fieldForm.get('description').value) {
      description = this.fieldForm.get('description').value;
    }
    const crop = this.fieldForm.get('crop').value;

    const soilType = this.fieldForm.get('soilType').value;
    const plantDateValue = this.fieldForm.get('plantDate').value;
    formattedDate = formatDate(plantDateValue, 'yyyy-MM-dd', 'en-US');
    const sensorList = this.sensors;
    const id = this.id;
    this.cropValue.seedingDate = new Date(formattedDate);
    const params: Field = {
      id,
      fieldName: name,
      soil: soilType,
      description: description || undefined,
      crop: this.cropValue,
      plantDate: new Date(formattedDate),
    };
    this.fieldService.storeFieldsInLocalStorage(params);
    Object.values(this.sensorActions).forEach((sensorAction: any) => {
      if (sensorAction?.action === 'added') {
        this.sensorV2Service.updateSensorName(
          sensorAction.sensor.mac,
          sensorAction.sensor.name,
          sensorAction.sensor.sensorType,
          id
        );
      } else if (sensorAction?.action === 'removed') {
        this.sensorV2Service.updateSensorName(
          sensorAction.sensor.mac,
          sensorAction.sensor.name,
          sensorAction.sensor.sensorType,
          ''
        );
      }
    });
    this._snackBar.open(
      'Sensor list may take a while to update based on the interval settings of the sensor. You can go back or refresh this page after a while.',
      'Ok',
      {
        duration: 10000,
      }
    );
    this.router.navigate([`/dashboard/fields`]);
  }
}
