import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  sensorDetails: any;

  headerConfig: HeaderConfig = {
    headerTitle: 'Sensor Details',
    leftIconName: 'arrow_back',
    rightIconName: 'edit',
    leftBtnClick: this.backClicked.bind(this),
    rightBtnClick: null,
  };

  displayedColumns: string[] = ['date', 'time', 'moisturelevel'];
  pastReadingsData: PastReadings[] = [
    {
      datetime: new Date(1685088000000), // June 25, 2023 11:00 AM
      moisturelevel: 50.09
    },
    {
      datetime: new Date(1685224800000), // July 4, 2023 2:30 PM
      moisturelevel: 42.75
    },
    {
      datetime: new Date(1685526000000), // July 20, 2023 9:15 AM
      moisturelevel: 55.33
    },
    {
      datetime: new Date(1685878800000), // July 27, 2023 4:45 PM
      moisturelevel: 48.21
    },
    {
      datetime: new Date(1686168000000), // June 30, 2023 3:00 PM
      moisturelevel: 60.88
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.route.params.subscribe((params) => {
      const sensorId = params['sensorId'];
      this.loadSensorDetails(sensorId);
    });
  }

  loadSensorDetails(sensorId: string): void {
    this.sensorDetails = sensors.find((sensor) => sensor.id === sensorId);
  }

  backClicked() {
    const url = `/dashboard/sensors`;
    this.router.navigate([url]);
  }
}

export interface PastReadings {
  datetime: Date;
  moisturelevel: number;
}
