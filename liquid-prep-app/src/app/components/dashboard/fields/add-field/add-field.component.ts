import { Component, OnInit, TemplateRef } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FieldDataService } from 'src/app/service/FieldDataService';
import { nanoid } from 'nanoid';
import { Field } from 'src/app/models/Field';
import { MatDialog } from '@angular/material/dialog';
import { SENSORS_MOCK_DATA } from '../../sensors/sensor-data';
import { SensorListComponent } from '../sensor-list/sensor-list.component';
import { CropDataService } from 'src/app/service/CropDataService';
import { forkJoin, from } from 'rxjs';
import { CropInfoResp } from '../../../../models/api/CropInfoResp';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { SensorV2Service } from 'src/app/service/sensor-v2.service';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})
export class AddFieldComponent implements OnInit {
  headerConfig: HeaderConfig = {
    headerTitle: 'Add Field',
    leftIconName: 'arrow_back',
    rightIconName: 'save',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: this.save.bind(this),
  };

  fieldForm: FormGroup;
  sensorsData = SENSORS_MOCK_DATA;
  sensors: any[] = [];
  cropsList;
  cropValue;
  progress: boolean = false;

  constructor(
    private headerService: HeaderService,
    private location: Location,
    private router: Router,
    private fieldService: FieldDataService,
    private cropService: CropDataService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private sensorV2Service: SensorV2Service
  ) {}

  ngOnInit(): void {
    const id = nanoid(4);
    console.log(id);
    this.headerService.updateHeader(this.headerConfig);
    this.loadForm();
    this.loadCropData();
  }

  loadForm() {
    this.fieldForm = new FormGroup({
      fieldName: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      crop: new FormControl(null, [Validators.required]),
      soilType: new FormControl(null, [Validators.required]),
      plantDate: new FormControl(null, [Validators.required]),
      // cropSelect: new FormControl(),
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
    this.location.back();
  }

  public openFullViewDialog(): void {
    const dialogRef = this.dialog.open(SensorListComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let exists = this.sensors.find((sensor) => sensor.mac === result.mac);
        if (!exists) {
          this.sensors.push(result);
        }
      }
    });
  }

  public removeSensor(macAddress) {
    const index = this.sensors.indexOf((sensor) => sensor.mac === macAddress);
    this.sensors.splice(index, 1);
  }

  public save() {
    console.log(this.fieldForm.value);
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
    const cropType = this.fieldForm.get('crop').value;

    const soilType = this.fieldForm.get('soilType').value;

    const plantDateValue = this.fieldForm.get('plantDate').value;
    if (plantDateValue instanceof Date) {
      formattedDate = formatDate(plantDateValue, 'yyyy-MM-dd', 'en-US');
    } else {
      console.error('plantDate is not a Date object');
    }
    const id = nanoid(4);
    const params: Field = {
      id,
      fieldName: name,
      description: description || undefined,
      soil: soilType,
      crop: {
        seedingDate: new Date(formattedDate),
        waterDate: new Date(formattedDate),
        type: cropType,
      },
      plantDate: new Date(formattedDate),
    };
    this.fieldService.storeFieldsInLocalStorage(params);
    this.sensors.forEach((sensor) => {
      this.sensorV2Service.updateSensorName(
        sensor.mac,
        sensor.name,
        sensor.sensorType,
        id
      );
    });

    this._snackBar.open(
      'Sensor list may take a while to update based on the interval settings of the sensor. You can go back or refresh this page after a while.',
      'Ok',
      {
        duration: 10000,
      }
    );
    this.router.navigate([`dashboard/fields`]);
  }

  openDialog(dialogTemplate: TemplateRef<any>): void {
    this.dialog.open(dialogTemplate, {
      height: '430px',
      width: '400px',
    });
  }

  clickCropNext() {
    this.cropValue = this.fieldForm.get('cropSelect').value;
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
  }
}
