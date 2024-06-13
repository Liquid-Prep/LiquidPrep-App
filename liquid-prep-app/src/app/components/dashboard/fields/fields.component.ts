import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { SelectModalComponent } from 'src/app/components/select-modal/select-modal.component';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FieldDataService } from 'src/app/service/FieldDataService';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
})
export class FieldsComponent implements OnInit {
  selectedOption: string = 'lastUpdated';
  selectedLabel: string = 'last updated time';
  sortOptions: Array<{ value: string; label: string }> = [
    { value: 'plantDate', label: 'Plant Date' },
    { value: 'fieldName', label: 'Field Name (A-Z)' },
    { value: 'cropName', label: 'Crop Name (A-Z)' },
  ];

  isFilterVisible: boolean = false;
  isFilteredByVisible: boolean = false;
  isSearchVisible: boolean = false;
  isSortedByVisible: boolean = true;
  searchQuery: string = '';

  headerConfig: HeaderConfig = {
    headerTitle: 'Fields',
    leftIconName: 'menu',
    rightIconName: 'cached',
    leftBtnClick: null,
    rightBtnClick: this.reload.bind(this),
    sortIconName: 'swap_vert',
    sortBtnClick: this.openSortModal.bind(this),
    filterIconName: 'search',
    filterBtnClick: this.toggleSearch.bind(this),
  };

  fields: any[] = [];
  displayedFields: any[] = [];

  constructor(
    public dialog: MatDialog,
    private headerService: HeaderService,
    private router: Router,
    private fieldService: FieldDataService
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.getFields();
  }

  public onFieldClick(id: string) {
    this.router.navigate([`/details`], { queryParams: { id: id } });
  }

  public async getFields() {
    const myFields = await this.fieldService.getLocalStorageMyFields();
    this.fields = myFields;
    this.displayedFields = myFields;
  }

  public getFieldPhoto(type: string) {
    if (type === 'Corn') {
      return 'assets/crops-images/corn.png';
    } else if (type === 'Wheat') {
      return 'assets/crops-images/wheat.png';
    } else if (type === 'Cotton') {
      return 'assets/crops-images/cotton.png';
    } else if (type === 'Sorghum') {
      return 'assets/crops-images/sorghum.png';
    } else if (type === 'Soybean') {
      return 'assets/crops-images/soybean.png';
    } else {
      return 'assets/crops-images/missing.jpg';
    }
  }

  public openSortModal() {
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
        this.sortFields(selection.selectedOption);
      }
    });
  }

  toggleSearch() {
    this.displayedFields = this.fields;
    this.isSearchVisible = !this.isSearchVisible;

    if (this.isSearchVisible) {
      this.isFilterVisible = false;
      this.isFilteredByVisible = false;
      this.isSortedByVisible = false;
    }
  }

  onSearchInputChange() {
    this.displayedFields = this.fields.filter((field) => {
      return field.fieldName
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });
  }

  sortFields(selected: string) {
    console.log(selected);
    switch (selected) {
      case 'plantDate':
        this.displayedFields.sort((a, b) => a.plantDate - b.plantDate);
        break;
      case 'fieldName':
        this.displayedFields.sort((a, b) => {
          const nameA = a.fieldName.toUpperCase();
          const nameB = b.fieldName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case 'cropName':
        this.displayedFields.sort((a, b) => {
          const nameA = a.crop.cropName.toUpperCase();
          const nameB = b.crop.cropName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      default:
    }
  }

  public addField() {
    this.router.navigateByUrl(`add-field`);
  }

  public reload() {
    location.reload();
  }
}
