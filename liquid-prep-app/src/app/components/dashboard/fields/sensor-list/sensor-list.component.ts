import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { SENSORS_MOCK_DATA } from './../../sensors/sensor-data';
import { SensorStorageService } from 'src/app/service/sensor-storage.service';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss'],
})
export class SensorListComponent implements OnInit {
  form: UntypedFormGroup;
  sensors = SENSORS_MOCK_DATA;
  selectedOption: string;

  constructor(
    public dialogRef: MatDialogRef<SensorListComponent>,
    private sensorStorageService: SensorStorageService,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      selectedOption: new UntypedFormControl(''),
    });
  }

  ngOnInit(): void {
    this.saveSensorData();
    this.retrieveSensorData();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addSensor(): void {
    this.dialogRef.close(this.form.value.selectedOption);
  }

  private saveSensorData() {
    const savedSensors = this.sensorStorageService.getSensorData();

    if (!savedSensors || savedSensors.length === 0) {
      const sensors = SENSORS_MOCK_DATA;
      this.sensorStorageService.saveSensorData(sensors);
    }
  }

  private retrieveSensorData() {
    const savedSensors = this.sensorStorageService.getSensorData();
    this.sensors = savedSensors;
  }
}
