import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/service/header.service';
import { SortModalComponent } from '../../sort/sort-modal.component';
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
  isSearchVisible: boolean = false;
  displayedItems: any[] = [];
  searchQuery: string = '';

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
    private datePipe: DatePipe
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

  ngOnInit(): void {
    this.headerService.updateHeader(
      'Sensors', // headerTitle
      'arrow_back', // leftIconName
      'search', // rightIconName
      this.handleLeftClick.bind(this), // leftBtnClick
      this.toggleSearch.bind(this), // rightBtnClick
      'swap_vert', // sortIconName
      this.openSortModal.bind(this), // sortBtnClick
      'filter_list', // sortIconName
      this.toggleFilter.bind(this) // filterBtnClick
    );

    this.filterOptions = this.getSelectedFilterOptions();
    this.filterOptions.connectionStatusOptions.sort();
    this.filterOptions.fieldLocationOptions.sort();

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
      data: { selectedSortOption: this.selectedSortOption },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedSortOption = result;
        this.applyFilterAndSort();
      }
    });
  }

  sortItems() {
    switch (this.selectedSortOption) {
      case 'sensorName':
        this.displayedItems.sort((a, b) => a.sensorName.localeCompare(b.sensorName));
        break;
      case 'fieldLocation':
        this.displayedItems.sort((a, b) => a.fieldLocation.localeCompare(b.fieldLocation));
        break;
      case 'connectionStatus':
        this.displayedItems.sort((a, b) => a.connectionStatus.localeCompare(b.connectionStatus));
        break;
      default: // 'lastUpdated' or any other invalid option
        this.displayedItems.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));
        break;
    }
  }

  toggleFilterOption(option: string) {
    const index = this.selectedFilterOptions.indexOf(option);

    if (index !== -1) {
      // Filter option is already selected, so remove it
      this.selectedFilterOptions.splice(index, 1);
    } else {
      // Filter option is not selected, so add it
      this.selectedFilterOptions.push(option);
    }

    // Apply filtering and sorting based on selected options
    this.applyFilterAndSort();
  }

  applyFilterAndSort() {
    // Apply filtering based on selected filter options
    let filteredItems = [...this.items];

    if (this.selectedFilterOptions.length > 1) {
      filteredItems = filteredItems.filter((item) => {

        return (
          this.selectedFilterOptions.includes(item.fieldLocation) &&
          this.selectedFilterOptions.includes(item.connectionStatus)
        );
      });
    } else {
      filteredItems = filteredItems.filter((item) => {

        return (
          this.selectedFilterOptions.includes(item.fieldLocation) ||
          this.selectedFilterOptions.includes(item.connectionStatus)
        );
      });
    }

    // Update the displayedItems with the filtered and sorted items
    this.displayedItems = filteredItems;

    // Apply sorting based on the selected sort option
    switch (this.selectedSortOption) {
      case 'sensorName':
        this.displayedItems.sort((a, b) => a.sensorName.localeCompare(b.sensorName));
        break;
      case 'fieldLocation':
        this.displayedItems.sort((a, b) => a.fieldLocation.localeCompare(b.fieldLocation));
        break;
      case 'connectionStatus':
        this.displayedItems.sort((a, b) => a.connectionStatus.localeCompare(b.connectionStatus));
        break;
      default:
        this.displayedItems.sort((a, b) => {
          const dateA = new Date(a.lastUpdated);
          const dateB = new Date(b.lastUpdated);
          // Compare in descending order (most recent first)
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }
  }

  clearFilter() {
    this.selectedFilterOptions = []; // Clear all selected filter options
    this.applyFilterAndSort(); // Reapply filtering and sorting
  }

  // Function to get selected filter options from the items data
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
    }
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;

    if (this.isSearchVisible) {
      this.clearFilter();
      this.isFilterVisible = false;
    }
  }

  onSearchInputChange() {
    this.applySearchFilter();
  }

  applySearchFilter() {
    this.displayedItems = this.items.filter((item) => {

      return (
        item.sensorName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.fieldLocation.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

}
