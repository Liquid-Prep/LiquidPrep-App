import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { sensors } from '../sensor-data';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-sensor-details',
  templateUrl: './sensor-details.component.html',
  styleUrls: ['./sensor-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SensorDetailsComponent implements OnInit {
  sensor: any;
  sensorId: string;

  headerConfig: HeaderConfig = {
    headerTitle: 'Sensor Details',
    leftIconName: 'arrow_back',
    rightIconName: 'edit',
    leftBtnClick: this.backClicked.bind(this),
    rightBtnClick: this.editSensorClicked.bind(this),
  };

  displayedColumns: string[] = ['date', 'time', 'moisturelevel'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.route.params.subscribe((params) => {
      this.sensorId = params['sensorId'];
      this.loadSensorDetails(this.sensorId);
    });
  }

  loadSensorDetails(sensorId: string): void {
    this.sensor = sensors.find((sensor) => sensor.id === sensorId);

    if (this.sensor && this.sensor.lastUpdatedTime) {
      this.sensor.formattedLastUpdatedTime = this.convertAndFormatDate(this.sensor.lastUpdatedTime * 1000);
    }
    if (this.sensor && this.sensor.nextScheduledReading) {
      this.sensor.formattedNextUpdatedTime = this.convertAndFormatDate(this.sensor.nextScheduledReading * 1000);
    }
  }

  public backBrowserClicked() {
    this.location.back();
  }

  backClicked() {
    const url = `/dashboard/sensors`;
    this.router.navigate([url]);
  }

  editSensorClicked() {
    const sensorId = this.sensorId;
    const url = `/dashboard/sensors/edit/${sensorId}`;
    this.router.navigate([url]);
  }

  isToday(lastUpdatedTime: number): boolean {
    const currentDate = new Date();
    const updatedDate = new Date(lastUpdatedTime * 1000);
    return currentDate.toDateString() === updatedDate.toDateString();
  }

  convertAndFormatDate = (inputDate) => {
    // Create a Date object from the input ISO string
    const date = new Date(inputDate);
    const targetTimeZone = 'America/New_York';

    // Define the formatting options with type annotations
    const options: Intl.DateTimeFormatOptions = {
      timeZone: targetTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      hour12: true,
    };

    // Format the date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    const datePart = formattedDate.split(', ')[0];
    const timePart = formattedDate.split(', ')[1];

    const formattedDateAtTime = `${datePart} at ${timePart}`;

    return formattedDateAtTime;
  };

}
