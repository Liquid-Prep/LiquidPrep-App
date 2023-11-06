import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SENSORS_MOCK_DATA } from './../../sensors/sensor-data';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss'],
})
export class SensorListComponent implements OnInit {
  form: FormGroup;
  sensors = SENSORS_MOCK_DATA;
  selectedOption: string;

  constructor(
    public dialogRef: MatDialogRef<SensorListComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      selectedOption: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  addSensor(): void {
    this.dialogRef.close(this.form.value.selectedOption);
  }
}
