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
  hours: string[] = [];
  timesPerDayOptions: { value: string; label: string }[] = [];
  timeBetweenOptions: { value: string; label: string }[] = [];
  selectedTimesPerDay: string = '';
  selectedTimeBetween: string = '';
  isSensorDisabled: boolean = false;
  showDeviceLocatorButton: boolean = false;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    public dialog: MatDialog,
    private sensorStorageService: SensorStorageService
  ) {
    for (let i = 0; i < 24; i++) {
      const hour = this.formatHour(i);
      this.hours.push(hour);
    }

    // Times per day
    for (let i = 1; i <= 24; i++) {
      this.timesPerDayOptions.push({
        value: `timesPerDay${i}`,
        label: i.toString(),
      });

      // TODO: Fix logic to limit the timeBetweenOptions based on selectedTimesPerDay
      if (i === 1) {
        this.timeBetweenOptions.push({
          value: `timeBetween${i}`,
          label: `${i} hour`,
        });
      } else if (i <= 24) {
        this.timeBetweenOptions.push({
          value: `timeBetween${i}`,
          label: `${i} hours`,
        });
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
    this.retrieveSensorData();
    this.route.params.subscribe((params) => {
      this.sensorId = params['sensorId'];

      this.loadSensorDetails(this.sensorId);
    });
    this.retrieveSensorData();
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
    this.selectedFieldName = this.sensor.fieldLocation === null ? 'None' : this.sensor.fieldLocation ;
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

    // Place "None" at the top of the list
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
    const currentFieldLabel: string = currentField === null ? 'None' : currentField;
    const selectedOption = fields.find((field) => field.label === currentFieldLabel)?.value || null;

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
        this.selectedField = selection?.selectedOption === null ? null : selection?.selectedLabel;
        this.selectedFieldName = selection?.selectedLabel;
        this.selectedFieldValue = selection?.selectedOption;
      } else {
        this.selectedField = selectedOption;
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
    const sensorToUpdate = this.sensors.find(sensor => sensor.id === this.sensor.id);

    if (sensorToUpdate) {
        // Update the properties of the correct sensor
        sensorToUpdate.sensorName = this.sensorName;
        sensorToUpdate.geocode = this.geocode;
        sensorToUpdate.fieldLocation = this.selectedField;

        // Save the updated data to the storage service
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
