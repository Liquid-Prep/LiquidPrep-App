import {Component, OnInit, TemplateRef, ViewChild,} from '@angular/core';
import {HeaderService} from 'src/app/service/header.service';
import {HeaderConfig} from 'src/app/models/HeaderConfig.interface';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {formatDate, Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldDataService} from 'src/app/service/FieldDataService';
import {SENSORS_MOCK_DATA} from '../../sensors/sensor-data';
import {Field} from 'src/app/models/Field';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SensorListComponent} from '../sensor-list/sensor-list.component';
import {CropDataService} from 'src/app/service/CropDataService';
import {forkJoin, from} from 'rxjs';
import {Crop} from "../../../../models/Crop";

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss'],
})
export class EditFieldComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  headerConfig: HeaderConfig = {
    headerTitle: 'Edit Field',
    leftIconName: 'arrow_back',
    rightIconName: 'save',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: this.save.bind(this),
  };
  id: string;
  fieldForm: UntypedFormGroup;
  fieldDetails: any;
  sensorsData = SENSORS_MOCK_DATA;
  sensors: any[] = [];
  cropsList;
  cropValue;
  progress: boolean = false;

  constructor(
    private headerService: HeaderService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private fieldService: FieldDataService,
    private cropService: CropDataService,
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

  loadForm() {
    this.fieldForm = new UntypedFormGroup({
      fieldName: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null),
      crop: new UntypedFormControl(null, [Validators.required]),
      plantDate: new UntypedFormControl(null, [Validators.required]),
      cropSelect: new UntypedFormControl(),
      soilType: new UntypedFormControl(null, [Validators.required]),
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
    this.sensors = this.fieldDetails.sensors;
    this.cropValue = this.fieldDetails.crop;
  }

  public async getFieldDetails(id: string) {
    this.fieldDetails = await this.fieldService.getFieldFromMyFieldById(id);
    this.patchFieldValue();
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
    formattedDate = formatDate(plantDateValue, 'yyyy-MM-dd', 'en-US');

    const cropSelected: Crop = Object.assign(new Crop(), this.fieldForm.get('crop').value);
    cropSelected.fetchCropInfoIfNeeded(this.cropService)
      .then(()=>{
        cropSelected.seedingDate = new Date(formattedDate);
        const sensorList = this.sensors;
        const id = this.id;

        const params: Field = {
          id,
          fieldName: name,
          soil: soilType,
          description: description || undefined,
          crop: cropSelected,
          plantDate: new Date(formattedDate),
          sensors: sensorList,
        };
        this.fieldService.storeFieldsInLocalStorage(params).then(r => {});
        this.router.navigate([`/dashboard/fields`]).then(r => {});
      })
      .catch((error: any)=>{
        alert('Save Edit-Field-- Could not get crop info: ' + error);
        console.error('Save Edit-Field Error getting CropInfo:', error);
      });
  }
}
