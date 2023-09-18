import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { SortModalComponent } from '../../sort-modal/sort-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
  encapsulation : ViewEncapsulation.None,
})
export class SensorsComponent implements OnInit {

  selectedSortOption: string = '';
  selectedFilterOption: string = '';
  selectedFilterOptions: string[] = [];
  filterOptions: {
    connectionStatusOptions: string[],
    fieldLocationOptions: string[] } = {
      connectionStatusOptions: [],
      fieldLocationOptions: [],
  };
  isFilterVisible: boolean = false;
  isFilteredByVisible: boolean = false;
  isSearchVisible: boolean = false;
  displayedItems: any[] = [];
  searchQuery: string = '';

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

  items = [
    {
      lastUpdated: '1694674978',
      sensorName: 'A6',
      fieldLocation: 'Field 1',
      moistureLevel: 43.12,
      connectionStatus: 'Connected',
    },
    {
      lastUpdated: '1694611378',
      sensorName: 'A4',
      fieldLocation: 'Field 1',
      moistureLevel: 65,
      connectionStatus: 'Connected',
    },
    {
      lastUpdated: '1632215520',
      sensorName: 'A3',
      fieldLocation: 'Field 2',
      moistureLevel: 42,
      connectionStatus: 'Connected',
    },
    {
      lastUpdated: '1689365400',
      sensorName: 'A2',
      fieldLocation: 'Field 4',
      moistureLevel: 50,
      connectionStatus: 'Connected',
    },
    {
      lastUpdated: '1689182700',
      sensorName: 'A5',
      fieldLocation: 'Field 3',
      moistureLevel: 65.16,
      connectionStatus: 'Connected',
    },
    {
      lastUpdated: '1691813700',
      sensorName: 'A1',
      fieldLocation: 'Field 5',
      moistureLevel: 44,
      connectionStatus: 'Not Connected',
    },
  ];

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private headerService: HeaderService,
    private datePipe: DatePipe,
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
  private lastSelectedSortOption: string = '';

  ngOnInit(): void {

    this.headerService.updateHeader(this.headerConfig);

    this.filterOptions = this.getSelectedFilterOptions();
    this.filterOptions.connectionStatusOptions.sort();
    this.filterOptions.fieldLocationOptions.sort();
    this.lastSelectedSortOption = this.selectedSortOption;

    // Initialize displayedItems with the original sensor data
    this.displayedItems = [...this.items];

    // Convert Date format
    this.items.forEach((item) => {
      const epochTimestamp = parseInt(item.lastUpdated, 10);
      const utcDate = new Date(epochTimestamp * 1000);

      // Calculate today and yesterday dates
      const now = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (isSameDate(utcDate, now)) {
        item.lastUpdated = 'today ' + this.datePipe.transform(utcDate, 'h:mm a');
      } else if (isSameDate(utcDate, yesterday)) {
        item.lastUpdated = 'yesterday ' + this.datePipe.transform(utcDate, 'h:mm a');
      } else {
        item.lastUpdated = this.datePipe.transform(utcDate, "MM.dd.yy 'at' h:mm a");
      }
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

  openSortModal() {
    const dialogRef = this.dialog.open(SortModalComponent, {
      width: '80%',
      data: { selectedSortOption: this.lastSelectedSortOption },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedSortOption = result;
        this.lastSelectedSortOption = this.selectedSortOption;
        this.sortItems();
      }
    });
  }

sortItems() {
  this.displayedItems.sort((a, b) => {
    switch (this.selectedSortOption) {
      case 'sensorName':
        return a.sensorName.localeCompare(b.sensorName);
      case 'fieldLocation':
        return a.fieldLocation.localeCompare(b.fieldLocation);
      case 'connectionStatus':
        return this.toggleConnectionStatusSort(a.connectionStatus, b.connectionStatus);
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
    let filteredItems = [...this.items];

    if (this.selectedFilterOptions.length > 0) {
      filteredItems = filteredItems.filter((item) => {

        return (
          this.selectedFilterOptions.includes(item.fieldLocation) ||
          this.selectedFilterOptions.includes(item.connectionStatus)
        );
      });
    }

    // Update the displayedItems with the filtered and sorted items
    this.displayedItems = filteredItems;
    this.toggleFilter();
  }

  clearFilter() {
    this.selectedFilterOptions = []; // Clear all selected filter options
    this.displayedItems = [...this.items]; // Reset displayedItems to the original list
    this.isFilteredByVisible = false;
  }

  clearFilterAndClose() {
    this.clearFilter();
    this.toggleFilter();
  }

  // Get filter sellections
  getSelectedFilterOptions() {
    const selectedConnectionStatus = new Set<string>();
    const selectedFieldLocation = new Set<string>();

    this.items.forEach((item) => {
      selectedConnectionStatus.add(item.connectionStatus);
      selectedFieldLocation.add(item.fieldLocation);
    });

    return {
      connectionStatusOptions: Array.from(selectedConnectionStatus),
      fieldLocationOptions: Array.from(selectedFieldLocation),
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
    }

  }

  toggleSearch() {
    this.displayedItems = this.items;
    this.isSearchVisible = !this.isSearchVisible;

    if (this.isSearchVisible) {
      this.isFilterVisible = false;
      this.isFilteredByVisible = false;
    }

  }

  onSearchInputChange() {
    this.applySearchFilter();
  }

  applySearchFilter() {
    this.displayedItems = this.items.filter((item) => {

      return (
        item.sensorName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.fieldLocation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.moistureLevel.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

}
