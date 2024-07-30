import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../dialog/dialog.component';
import { FieldDataService } from 'src/app/service/FieldDataService';
import { SensorStorageService } from 'src/app/service/sensor-storage.service';

@Component({
  selector: 'app-sensor-type-and-field',
  templateUrl: './sensor-type-and-field.component.html',
  styleUrls: ['./sensor-type-and-field.component.scss']
})
export class SensorTypeAndFieldComponent implements OnInit {

  name = '';
  sensorType = '';
  fieldId = '';

  fieldOptions = [];
  
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fieldService: FieldDataService,
    private sensorStorageService: SensorStorageService
  ) { }

  async ngOnInit() {
    this.name = this.data?.sensor?.name || '';
    this.sensorType = this.data?.sensor?.sensorType || '';
    this.fieldId = this.data?.sensor?.fieldId || '';

    let fields = await this.fieldService.getLocalStorageMyFields();
    this.fieldOptions = fields.map(field=> {
      return {
        value: field.id,
        label: field.fieldName
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.data.mac) {
      this.sensorStorageService.updateSensorByMacAddress(this.data.mac, this.name, this.sensorType, this.fieldId);
      this.dialogRef.close("SAVED");
    }
  }
}
