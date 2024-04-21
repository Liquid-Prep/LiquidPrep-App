import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SensorStorageService } from 'src/app/service/sensor-storage.service';

@Component({
  selector: 'app-moisture-logs',
  templateUrl: './moisture-logs.component.html',
  styleUrls: ['./moisture-logs.component.scss'],
})
export class MoistureLogsComponent implements OnInit {
  selected: Date | null;
  selectedDate: any;
  percentageValues = 0;
  sensor;
  fieldName: String;
  cropType: String;
  pastReadings;

  constructor(
    public dialogRef: MatDialogRef<MoistureLogsComponent>,
    private sensorStorageService: SensorStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.fieldName = this.data.fieldName;
    this.cropType = this.data.cropType;
    this.retrieveSensorData();
  }

  onDateChange(date: Date) {
    // Handle the date change here
    this.selectedDate = this.formatDate(date);
    // Retrive Past Readings Based on Date
    this.pastReadings = this.sensor.pastReadings.filter((reading) => {
      const date = this.formatUnixTimestamp(reading.dateTime, true);
      return this.selectedDate === date;
    });
    const add = this.pastReadings.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.moistureLevel;
    }, 0);
    this.percentageValues = add / this.pastReadings.length;
  }

  private retrieveSensorData() {
    const savedSensors = this.sensorStorageService.getSensorData();
    this.sensor = savedSensors.find((sensor) => {
      return sensor.id === this.data.sensorId;
    });
    if (this.sensor.pastReadings[0].dateTime) {
      const todayDate = new Date(
        this.formatUnixTimestamp(this.sensor.pastReadings[0].dateTime, true)
      );
      this.selectedDate;
      this.onDateChange(todayDate);
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}
