import { Component, ViewEncapsulation, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sort-modal',
  templateUrl: './sort-modal.component.html',
  styleUrls: ['./sort-modal.component.scss'],
  encapsulation : ViewEncapsulation.None,
})

export class SortModalComponent implements OnInit {
  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();
  title: string;
  selectedSortOption: string = 'lastUpdated';

  constructor(
    public dialogRef: MatDialogRef<SortModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  saveSelection() {
    this.dialogRef.close(this.selectedSortOption);
  }
}

