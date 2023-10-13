import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { sensors } from '../sensor-data';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { MatDialog } from '@angular/material/dialog';
import { SensorLocatorModalComponent } from '../../../sensor-locator-modal/sensor-locator-modal.component';
import { UnsavedChangesModalComponent } from '../../../unsaved-changes-modal/unsaved-changes-modal.component';
import { SelectModalComponent } from '../../../select-modal/select-modal.component';

@Component({
  selector: 'app-edit-sensor',
  templateUrl: './edit-sensor.component.html',
  styleUrls: [
    '../sensor-details/sensor-details.component.scss',
    './edit-sensor.component.scss',
],
  encapsulation: ViewEncapsulation.None,
})
export class EditSensorComponent implements OnInit {
  sensor: any;
  hours: string[] = [];
  timesPerDayOptions: { value: string; label: string }[] = [];
  timeBetweenOptions: { value: string; label: string }[] = [];
  selectedTimesPerDay: string = '';
  selectedTimeBetween: string = '';
  isSensorDisabled: boolean = false;
  showDeviceLocatorButton: boolean = false;
  selectedField: string = '';
  selectedFieldValue: string = '';
  lastSelectedOption: string = '';

  headerConfig: HeaderConfig = {
    headerTitle: 'Edit Sensor',
    leftIconName: 'arrow_back',
    rightTextBtn: 'Save',
    leftBtnClick: this.confirmExit.bind(this),
    rightBtnClick: null,
  };

  sensorName: string;
  sensorId: string;
  geocode: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    public dialog: MatDialog
  ) {

    for (let i = 0; i < 24; i++) {
      const hour = this.formatHour(i);
      this.hours.push(hour);
    }

    // Generate an array of times per day options
    for (let i = 1; i <= 24; i++) {
      this.timesPerDayOptions.push({ value: `timesPerDay${i}`, label: i.toString() });

      // Limit the timeBetweenOptions based on selectedTimesPerDay
      if (i === 1) {
        this.timeBetweenOptions.push({ value: `timeBetween${i}`, label: `${i} hour` });
      } else if (i <= 24) {
        this.timeBetweenOptions.push({ value: `timeBetween${i}`, label: `${i} hours` });
      }
    }
  }

  private formatHour(hour: number): string {
    const amPm = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour.toString().padStart(2, '0')}:00 ${amPm}`;
  }

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.route.params.subscribe((params) => {
      this.sensorId = params['sensorId'];
      this.loadSensorDetails(this.sensorId);
    });
  }

  loadSensorDetails(sensorId: string): void {
    this.sensor = sensors.find((sensor) => sensor.id === sensorId);
    this.sensorName = this.sensor.sensorName;
    this.geocode = this.sensor.geocode;
  }


  backClicked() {
    const sensorId = this.sensorId;
    const url = `/dashboard/sensors/${sensorId}`;
    this.router.navigate([url]);
  }

// Extract field locations with value and label from the sensors array, including "None"
getAllFieldLocations = (sensorsArray) => {
  const fieldLocations = new Set<string>();
  sensorsArray.forEach((sensor) => {
    if (sensor.fieldLocation !== null) {
      fieldLocations.add(sensor.fieldLocation);
    }
  });

  // Add "None" as an option with a value of null
  fieldLocations.add("None");

  const uniqueFieldLocations = [...fieldLocations];

  // Sort the unique field locations and place "None" at the top
  uniqueFieldLocations.sort((a: string, b: string) => {
    if (a === "None") return -1;
    if (b === "None") return 1;
    return a.localeCompare(b);
  });

  const fieldLocationObjects = uniqueFieldLocations.map((location, index) => ({
    value: location === "None" ? null : `field${index + 1}`,
    label: location,
  }));

  return fieldLocationObjects;
};

  openLocatorModal() {
    const dialogRef = this.dialog.open(SensorLocatorModalComponent, {
      width: '80%',
      data: {
        geocode: this.sensor.geocode,
      },
    });

    dialogRef.afterClosed().subscribe((selection) => {
      if (selection) {
        this.geocode = selection;
        this.showDeviceLocatorButton = false;
      }
    });
  }

  openFieldSelectorModal() {
    const fields = this.getAllFieldLocations(sensors);
    const dialogRef = this.dialog.open(SelectModalComponent, {
      width: '80%',
      data: {
        selectedOption: this.selectedField || fields[1].value,
        selectedLabel: this.selectedField || fields[1].label,
        modalTitle: 'Select a field',
        options: fields,
      },
    });

    dialogRef.afterClosed().subscribe((selection) => {
      if (selection) {
        this.selectedField = selection.selectedLabel;
        this.selectedFieldValue = selection.selectedOption;
        this.lastSelectedOption = this.selectedFieldValue;
      }
    });
  }

  confirmExit() {
    const sensorId = this.sensorId;
    this.dialog.open(UnsavedChangesModalComponent, {
      width: '80%',
      data: {
        backLinkUrl: `/dashboard/sensors/${sensorId}`,
      },
    });
  }

}

export interface PastReadings {
  datetime: Date;
  moisturelevel: number;
}
