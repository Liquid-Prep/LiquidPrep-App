import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SENSORS_MOCK_DATA } from './../../sensors/sensor-data';
import { SensorStorageService } from 'src/app/service/sensor-storage.service';
import { SensorV2Service } from 'src/app/service/sensor-v2.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss'],
})
export class SensorListComponent implements OnInit {
  destroyed$ = new Subject<void>();
  form: FormGroup;
  sensors: any = [];
  selectedOption: string;

  constructor(
    public dialogRef: MatDialogRef<SensorListComponent>,
    private sensorV2Service: SensorV2Service,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      selectedOption: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.retrieveSensorData();
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addSensor(): void {
    this.dialogRef.close(this.form.value.selectedOption);
  }


  private retrieveSensorData() {
    this.sensorV2Service.fetchSensors().pipe(
      takeUntil(this.destroyed$)
    ).subscribe({
      next: sensors => {
        this.sensors = sensors;
        console.log(sensors);
      }
    });
  }

}
