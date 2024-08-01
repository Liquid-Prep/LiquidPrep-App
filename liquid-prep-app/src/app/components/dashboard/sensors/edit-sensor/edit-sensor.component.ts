import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { MatDialog } from '@angular/material/dialog';
import { SensorLocatorModalComponent } from '../../../sensor-locator-modal/sensor-locator-modal.component';
import { UnsavedChangesModalComponent } from '../../../unsaved-changes-modal/unsaved-changes-modal.component';
import { SelectModalComponent } from '../../../select-modal/select-modal.component';
import { SensorStorageService } from '../../../../service/sensor-storage.service';
import type { SensorsData } from '../sensors.component';

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
  sensors: SensorsData;
  sensor: any;
  hours: number[] = [];
  timesPerDayOptions: { value: number; label: string }[] = [];
  timeBetweenOptions: { value: number; label: string }[] = [];
  selectedTimesPerDay: number;
  selectedTimeBetween: number = 0; // Initialize it with a default value

  firstReadingTime: number;
  formattedFirstReadingTime: string;
  timesPerDay: number;
  timeBetweenReading: number;

  selectedReadingTime: number;
  disableOnInactivity: boolean = false;
  isSensorDisabled: boolean = false;
  showDeviceLocatorButton: boolean = false;
  currentFieldLabel: string = '';
  selectedField: string = '';
  selectedFieldValue: string = '';
  selectedFieldName: string = '';
  sensorName: string;
  sensorId: string;
  geocode: string;

  headerConfig: HeaderConfig = {
    headerTitle: 'Edit Sensor',
    leftIconName: 'arrow_back',
    rightTextBtn: 'Save',
    leftBtnClick: this.confirmExit.bind(this),
    rightTextBtnClick: this.onSave.bind(this),
  };
  private newFieldSelection: any;
  private originalFieldSelection: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    public dialog: MatDialog,
    private sensorStorageService: SensorStorageService
  ) {
    for (let i = 0; i < 24; i++) {
      this.hours.push((i + 12) % 24); // Convert to 24-hour format
    }

    // Times per day
    for (let i = 1; i <= 24; i++) {
      this.timesPerDayOptions.push({
        value: i,
        label: i.toString(),
      });

      // TODO: Fix logic to limit the timeBetweenOptions based on selectedTimesPerDay
      if (i === 1) {
        this.timeBetweenOptions.push({
          value: i,
          label: `${i} hour`,
        });
      } else if (i <= 24) {
        this.timeBetweenOptions.push({
          value: i,
          label: `${i} hours`,
        });
      }
    }
  }

  formatHourLabel(selectedHour: number): string {
    const formattedHour = selectedHour % 12 === 0 ? 12 : selectedHour % 12;
    const amPm = selectedHour < 12 ? 'AM' : 'PM';
    return `${formattedHour.toString()}:00 ${amPm}`;
  }

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.retrieveSensorData();
    this.route.params.subscribe((params) => {
      this.sensorId = params['sensorId'];
      this.loadSensorDetails(this.sensorId);
    });
    this.retrieveSensorData();

    const amHours = this.hours.filter((hour) => hour < 12);
    const pmHours = this.hours.filter((hour) => hour >= 12);

    this.hours = amHours.concat(pmHours);

    // Format the selectedReadingTime to 12-hour format
    this.formattedFirstReadingTime = this.formatFirstReadingTime(
      this.selectedReadingTime
    );
  }

  private retrieveSensorData() {
    const savedSensors = this.sensorStorageService.getSensorData();
    this.sensors = savedSensors;
  }

  loadSensorDetails(sensorId: string): void {
    this.sensor = this.sensors.find((sensor) => sensor.id === sensorId);
    this.sensorName = this.sensor.sensorName;
    this.geocode = this.sensor.geocode;
    this.selectedField = this.sensor.fieldLocation;
    this.selectedFieldName =
      this.sensor.fieldLocation === null ? 'None' : this.sensor.fieldLocation;
    this.selectedReadingTime = this.sensor.broadcastIntervals.firstReadingTime;
    this.formattedFirstReadingTime = this.formatFirstReadingTime(
      this.firstReadingTime
    );
    this.selectedTimesPerDay = this.sensor.broadcastIntervals.timesPerDay;
    this.selectedTimeBetween =
      this.sensor.broadcastIntervals.timeBetweenReading;
  }

  formatFirstReadingTime(selectedReadingTime: number): string {
    if (
      selectedReadingTime !== null &&
      selectedReadingTime >= 0 &&
      selectedReadingTime <= 23
    ) {
      const formattedHour = selectedReadingTime;
      const amPm = selectedReadingTime < 12 ? 'AM' : 'PM';
      const displayHour =
        selectedReadingTime % 12 === 0 ? 12 : selectedReadingTime % 12;
      return `${displayHour.toString().padStart(2, '0')}:00 ${amPm}`;
    } else {
      return null;
    }
  }

  backClicked() {
    const sensorId = this.sensorId;
    const url = `/dashboard/sensors/${sensorId}`;
    this.router.navigate([url]);
  }

  // Extract field locations with value and label from the sensors array
  getAllFieldLocations = (sensorsArray) => {
    const fieldLocations = new Set<string>();
    sensorsArray.forEach((sensor) => {
      if (sensor.fieldLocation !== null) {
        fieldLocations.add(sensor.fieldLocation);
      }
    });

    fieldLocations.add('None');

    const uniqueFieldLocations = [...fieldLocations];

    // Place "None" at the top
    uniqueFieldLocations.sort((a: string, b: string) => {
      if (a === 'None') return -1;
      if (b === 'None') return 1;
      return a.localeCompare(b);
    });

    const fieldLocationObjects = uniqueFieldLocations.map(
      (location, index) => ({
        value: location === 'None' ? null : `field${index + 1}`,
        label: location,
      })
    );

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
    const fields = this.getAllFieldLocations(this.sensors);
    const currentField: string = this.sensor.fieldLocation;
    this.currentFieldLabel =
      currentField === null || currentField === undefined
        ? 'None'
        : currentField;

    const selectedOption =
      this.newFieldSelection?.selectedOption ||
      fields.find((field) => field.label === this.currentFieldLabel)?.value ||
      null;

    const dialogRef = this.dialog.open(SelectModalComponent, {
      width: '80%',
      data: {
        selectedOption: selectedOption,
        modalTitle: 'Select a field',
        options: fields,
      },
    });

    dialogRef.afterClosed().subscribe((selection: any) => {
      if (selection !== 'cancel') {
        this.newFieldSelection = selection;
        this.selectedField =
          selection?.selectedOption === null ? null : selection?.selectedLabel;
        this.selectedFieldName = selection?.selectedLabel;
        this.selectedFieldValue = selection?.selectedOption;

        // Store the selected option as the original selection
        this.originalFieldSelection = {
          selectedOption: selection.selectedOption,
          selectedLabel: selection.selectedLabel,
        };
      } else {
        // If "cancel" is selected, restore the original selection
        this.selectedField =
          this.originalFieldSelection.selectedOption === null
            ? null
            : this.originalFieldSelection.selectedLabel;
        this.selectedFieldName = this.originalFieldSelection.selectedLabel;
        this.selectedFieldValue = this.originalFieldSelection.selectedOption;
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

  updateAndSaveSensorData(): void {
    // Find the correct sensor within this.sensors based on the uuid
    const sensorToUpdate = this.sensors.find(
      (sensor) => sensor.id === this.sensor.id
    );

    if (sensorToUpdate) {
      // Update the properties of the identified sensor
      sensorToUpdate.sensorName = this.sensorName;
      sensorToUpdate.geocode = this.geocode;
      sensorToUpdate.fieldLocation = this.selectedField ?? null;
      sensorToUpdate.broadcastIntervals.timesPerDay = this.selectedTimesPerDay;
      sensorToUpdate.broadcastIntervals.timeBetweenReading =
        this.selectedTimeBetween;
      sensorToUpdate.broadcastIntervals.firstReadingTime =
        this.selectedReadingTime;
      sensorToUpdate.disableOnInactivity = this.disableOnInactivity;

      // Save the updated data to local storage
      this.sensorStorageService.saveSensorData(this.sensors);
    }
  }

  onSave() {
    const sensorId = this.sensorId;
    this.updateAndSaveSensorData();
    const url = `/dashboard/sensors/${sensorId}`;
    this.router.navigate([url]);
  }
}

export interface PastReadings {
  datetime: Date;
  moisturelevel: number;
}
