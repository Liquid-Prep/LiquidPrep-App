import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sort-modal',
  templateUrl: './sort-modal.component.html',
  styleUrls: ['./sort-modal.component.scss'],
  encapsulation : ViewEncapsulation.None,
})
export class SortModalComponent implements OnInit {
  title: string;
  selectedSortOption: string = 'lastUpdated';
  selectedSortLabel: string = 'Last Updated';

  constructor(
    public dialogRef: MatDialogRef<SortModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedSortOption = data.selectedSortOption || 'lastUpdated';
    this.selectedSortLabel = this.getLabelForSortOption(this.selectedSortOption);
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  saveSelection() {
    const selection = {
      selectedSortOption: this.selectedSortOption,
      selectedSortLabel: this.getLabelForSortOption(this.selectedSortOption)
    };
    this.dialogRef.close(selection);
  }

  getLabelForSortOption(option: string): string {
    switch (option) {
      case 'lastUpdated':
        return 'Last Updated Time';
      case 'sensorName':
        return 'Sensor Name (A-Z)';
      case 'fieldLocation':
        return 'Field Location (A-Z)';
      case 'connectionStatus':
        return 'Connection Status';
      default:
        return '';
    }
  }
}
