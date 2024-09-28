import {Component, OnInit, TemplateRef} from '@angular/core';
import {HeaderService} from 'src/app/service/header.service';
import {HeaderConfig} from 'src/app/models/HeaderConfig.interface';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {formatDate, Location} from '@angular/common';
import {Router} from '@angular/router';
import {FieldDataService} from 'src/app/service/FieldDataService';
import {Guid} from 'guid-typescript';
import {Field} from 'src/app/models/Field';
import {MatDialog} from '@angular/material/dialog';
import {SENSORS_MOCK_DATA} from '../../sensors/sensor-data';
import {SensorListComponent} from '../sensor-list/sensor-list.component';
import {CropDataService} from 'src/app/service/CropDataService';
import {forkJoin, from} from 'rxjs';
import {CropInfoResp} from '../../../../models/api/CropInfoResp';
import {Crop} from "../../../../models/Crop";

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

  fieldForm: UntypedFormGroup;
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
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.loadForm();
    this.loadCropData();
  }

  loadForm() {
    this.fieldForm = new UntypedFormGroup({
      fieldName: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null),
      cropSelected: new UntypedFormControl(null, [Validators.required]),
      soilType: new UntypedFormControl(null, [Validators.required]),
      plantDate: new UntypedFormControl(null, [Validators.required]),
    });
    const cropForm = this.fieldForm.get('cropSelected');
    cropForm.disable();
  }

  loadCropData() {
    this.progress = true;
    const cropForm = this.fieldForm.get('cropSelected');
    forkJoin({
      cropsListData: this.cropService.getCropListFromApi(),
      myCrops: from(this.cropService.getLocalStorageMyCrops()),
    }).subscribe(
      (results) => {
        this.cropsList = results.cropsListData;
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
    const dialogRef = this.dialog.open(SensorListComponent, {
      width: '80%',
      height: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.sensorsData.find((item) => item.id === result);
        this.sensors.push(data);
      }
    });
  }

  public removeSensor(id: String) {
    const data = this.sensors.find((item) => item.id === id);
    const index = this.sensors.indexOf(data);
    this.sensors.splice(index, 1);
  }

  public save() {
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

    const soilType = this.fieldForm.get('soilType').value;

    const plantDateValue = this.fieldForm.get('plantDate').value;
    if (plantDateValue instanceof Date) {
      formattedDate = formatDate(plantDateValue, 'yyyy-MM-dd', 'en-US');
    } else {
      console.error('plantDate is not a Date object');
    }

    const cropSelected: Crop = Object.assign(new Crop(), this.fieldForm.get('cropSelected').value);
    cropSelected.fetchCropInfoIfNeeded(this.cropService)
      .then(()=>{
        cropSelected.seedingDate = new Date(formattedDate)
        cropSelected.waterDate = new Date(formattedDate)
        const sensorList = this.sensors;
        const id = Guid.create().toString();
        const params: Field = {
          id,
          fieldName: name,
          description: description || undefined,
          soil: soilType,
          crop: cropSelected,
          plantDate: new Date(formattedDate),
          sensors: sensorList,
        };
        this.fieldService.storeFieldsInLocalStorage(params).then(r => {});
        this.router.navigate([`dashboard/fields`]).then(r => {});
      })
      .catch((error:any) => {
        alert('Save Add-Field Could not get crop info: ' + error);
        console.error('Save Add-Field Error getting CropInfo:', error);
      });
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
