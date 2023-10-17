import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { SelectModalComponent } from '../../select-modal/select-modal.component';
import { DatePipe } from '@angular/common';
import { SENSORS_MOCK_DATA } from './sensor-data';
import { SensorStorageService } from '../../../service/sensor-storage.service'; // Update the path

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SensorsComponent implements OnInit {
  sensors: SensorsData;
  selectedOption: string = 'lastUpdated';
  selectedLabel: string = 'last updated time';
  noFieldSelectedText: string = 'No field selected';
  selectedFilterOption: string = '';
  selectedFilterOptions: string[] = [];
  filterOptions: {
    connectionStatusOptions: string[];
    fieldLocationOptions: string[];
  } = {
    connectionStatusOptions: [],
    fieldLocationOptions: [],
  };
  isFilterVisible: boolean = false;
  isFilteredByVisible: boolean = false;
  isSearchVisible: boolean = false;
  isSortedByVisible: boolean = true;
  displayedSensors: any[] = [];
  searchQuery: string = '';
  clearSearchDisplayText: string = 'Clear search to see all sensors.';
  originalDisplayedSensorsLength: number;
  sortOptions: Array<{ value: string; label: string }> = [
    { value: 'lastUpdated', label: 'Last Updated Time' },
    { value: 'sensorName', label: 'Sensor Name (A-Z)' },
    { value: 'fieldLocation', label: 'Field Location (A-Z)' },
    { value: 'connectionStatus', label: 'Connection Status' },
  ];

  headerConfig: HeaderConfig = {
    headerTitle: 'Sensors',
    leftIconName: 'menu',
    rightIconName: 'search',
    leftBtnClick: null,
    rightBtnClick: this.toggleSearch.bind(this),
    sortIconName: 'swap_vert',
    sortBtnClick: this.openSortModal.bind(this),
    filterIconName: 'filter_list',
    filterBtnClick: this.toggleFilter.bind(this),
  };

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private headerService: HeaderService,
    private datePipe: DatePipe,
    private router: Router,
    private sensorStorageService: SensorStorageService
  ) {}

  public handleLeftClick(data: string) {
    this.backClicked();
  }

  public backClicked() {
    this.location.back();
  }

  public onHeaderClick(data: string) {
    if (data == 'leftBtn') {
      this.backClicked();
    } else {
      // TODO
    }
  }

  private renderedHeadings: Set<string> = new Set<string>();
  private lastSelectedOption: string = '';

  ngOnInit(): void {

    this.headerService.updateHeader(this.headerConfig);

    this.saveSensorData();
    this.retrieveSensorData();
    this.filterOptions = this.getSelectedFilterOptions();
    this.filterOptions.connectionStatusOptions.sort();
    this.filterOptions.fieldLocationOptions.sort();

    this.lastSelectedOption = this.selectedOption;

    // Initialize displayedSensors with the original sensor data
    this.displayedSensors = [...this.sensors];
    this.originalDisplayedSensorsLength = this.displayedSensors.length;

    if (this.displayedSensors.length === 0) {
      this.isFilterVisible = false;
      this.isSearchVisible = false;
      this.isFilteredByVisible = false;
      this.isSortedByVisible = false;
    }

    // Convert Date format
    this.sensors.forEach((sensor: Sensor) => {
      const epochTimestamp = sensor.lastUpdatedTime;
      const utcDate = new Date(epochTimestamp * 1000);

      // Calculate today and yesterday dates
      const now = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // Create a new property to store the formatted string
      sensor.formattedLastUpdatedTime = isSameDate(utcDate, now)
        ? 'today ' + this.datePipe.transform(utcDate, 'h:mm a')
        : isSameDate(utcDate, yesterday)
        ? 'yesterday ' + this.datePipe.transform(utcDate, 'h:mm a')
        : this.datePipe.transform(utcDate, "MM.dd.yy 'at' h:mm a");
    });

    // Function to check if two dates are on the same day
    function isSameDate(date1: Date, date2: Date): boolean {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    }
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

  openSortModal() {
    const sortOptions = this.sortOptions;
    const dialogRef = this.dialog.open(SelectModalComponent, {
      width: '80%',
      data: {
        selectedOption: this.selectedOption,
        selectedLabel: this.selectedLabel,
        modalTitle: 'Sort by',
        options: sortOptions,
      },
    });

    dialogRef.afterClosed().subscribe((selection) => {
      if (selection) {
        this.selectedOption = selection.selectedOption;
        this.selectedLabel = selection.selectedLabel.toLowerCase();
        this.lastSelectedOption = this.selectedOption;
        this.sortSensors();
      }
    });
  }

  sortSensors() {
    this.displayedSensors.sort((a, b) => {
      switch (this.selectedOption) {
        case 'sensorName':
          return a.sensorName.localeCompare(b.sensorName);
        case 'fieldLocation':
          return a.fieldLocation.localeCompare(b.fieldLocation);
        case 'connectionStatus':
          return this.toggleConnectionStatusSort(
            a.connectionStatus,
            b.connectionStatus
          );
        default:
          const dateA = new Date(a.lastUpdated * 1000);
          const dateB = new Date(b.lastUpdated * 1000);
          // Compare in descending order (most recent first)
          return dateB.getTime() - dateA.getTime();
      }
    });
  }

  toggleConnectionStatusSort(statusA: string, statusB: string): number {
    if (statusA === 'Not Connected' && statusB !== 'Not Connected') {
      return 1; // Move "Not Connected" to the bottom
    } else if (statusA !== 'Not Connected' && statusB === 'Not Connected') {
      return -1; // Move "Not Connected" to the bottom
    } else {
      return statusA.localeCompare(statusB); // Sort other statuses alphabetically
    }
  }

  toggleFilterOption(option: string) {
    const index = this.selectedFilterOptions.indexOf(option);

    if (index !== -1) {
      this.selectedFilterOptions.splice(index, 1);
    } else {
      this.selectedFilterOptions.push(option);
    }
  }

  applyFilterAndSort() {
    // Apply filtering based on selected filter options
    let filteredSensors = [...this.sensors];

    if (this.selectedFilterOptions.length > 0) {
      filteredSensors = filteredSensors.filter((sensor) => {
        return (
          this.selectedFilterOptions.includes(sensor.fieldLocation) ||
          this.selectedFilterOptions.includes(sensor.connectionStatus)
        );
      });
    }

    // Update the displayedSensors with the filtered and sorted sensors
    this.displayedSensors = filteredSensors;
    this.toggleFilter();
    this.isSortedByVisible = true;
  }

  clearFilter() {
    this.selectedFilterOptions = []; // Clear all selected filter options
    this.displayedSensors = [...this.sensors]; // Reset displayedSensors to the original list
    this.isFilteredByVisible = false;
  }

  clearFilterAndClose() {
    this.clearFilter();
    this.toggleFilter();
  }

  // Get filter selections
  getSelectedFilterOptions() {
    const selectedConnectionStatus = new Set<string>();
    const fieldLocationOptions = new Set<string>(); // Use a Set to deduplicate options

    this.sensors.forEach((sensor) => {
      selectedConnectionStatus.add(sensor.connectionStatus);
      if (sensor.fieldLocation !== null) {
        fieldLocationOptions.add(sensor.fieldLocation);
      }
    });

    // Convert the Sets back to arrays
    const connectionStatusOptions = Array.from(selectedConnectionStatus);
    const fieldLocationArray = Array.from(fieldLocationOptions);

    // Add "No field selected" at the top if it exists
    if (this.sensors.some((sensor) => sensor.fieldLocation === null)) {
      fieldLocationArray.unshift(null);
    }

    return {
      connectionStatusOptions,
      fieldLocationOptions: fieldLocationArray,
    };
  }

  isSelectedFilterOption(option: string): boolean {
    return this.selectedFilterOptions.includes(option);
  }

  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;

    if (this.isFilterVisible) {
      this.isSearchVisible = false;
      this.isFilteredByVisible = false;
      this.isSortedByVisible = false;

      this.headerService.updateHeader({
        headerTitle: null,
        leftIconName: 'arrow_back',
        leftBtnClick: this.clearFilterAndClose.bind(this),
        filterIconName: null,
        filterBtnClick: null,
        rightTextBtn: 'Apply Filters',
        rightTextBtnClick: this.applyFilterAndSort.bind(this),
      });
    } else {
      this.headerService.updateHeader({
        headerTitle: 'Sensors',
        leftIconName: 'menu',
        rightIconName: 'search',
        leftBtnClick: null,
        rightBtnClick: this.toggleSearch.bind(this),
        sortIconName: 'swap_vert',
        sortBtnClick: this.openSortModal.bind(this),
        filterIconName: 'filter_list',
        filterBtnClick: this.toggleFilter.bind(this),
      });
      if (this.selectedFilterOptions.length > 0) {
        this.isFilteredByVisible = true;
      }
      this.isSortedByVisible = true;
    }
  }

  toggleSearch() {
    this.displayedSensors = this.sensors;
    this.isSearchVisible = !this.isSearchVisible;

    if (this.isSearchVisible) {
      this.isFilterVisible = false;
      this.isFilteredByVisible = false;
      this.isSortedByVisible = false;
    }
  }

  onSearchInputChange() {
    this.applySearchFilter();
  }

  applySearchFilter() {
    this.displayedSensors = this.sensors.filter((sensor) => {
      return (
        sensor.sensorName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        (sensor.fieldLocation &&
          sensor.fieldLocation
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())) || // Check if fieldLocation is not null
        (sensor.moistureLevel &&
          sensor.moistureLevel
            .toString()
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())) // Check if moistureLevel is not null
      );
    });
  }

  onSensorClicked(sensorId) {
    const url = `/dashboard/sensors/${sensorId}`;
    this.router.navigate([url]);
  }
}

export interface Sensor {
  id: string;
  lastUpdatedTime: number;
  sensorName: string;
  fieldLocation: string;
  moistureLevel: number;
  geocode: string;
  nextScheduledReading: number;
  broadcastIntervals: {
      timesPerDay?: number | null;
      firstReadingTime?: number | null;
      timeBetweenReading?: number | null;
  };
  disableOnInactivity; boolean;
  pastReadings: { dateTime: number; moistureLevel: number }[];
  connectionStatus: string;
  connectionInfo: {
    edgeGateway: {
      value: string;
      url: string;
    };
    espNowGateway: {
      value: string;
      url: string;
    };
    webSocket: {
      url: string;
    };
  };
  formattedLastUpdatedTime?: string;
  formattedNextUpdatedTime?: string;
}

export type SensorsData = Sensor[];
