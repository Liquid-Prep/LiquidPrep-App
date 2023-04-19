import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crop-date-picker',
  templateUrl: './crop-date-picker.component.html', // Use a separate HTML file for the dialog template
})
export class CropDatePickerComponent {
  title: string; // Define the title property

  constructor(
    public dialogRef: MatDialogRef<CropDatePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
  }

  ngOnInit(): void {
    // Set formattedSelection to today's date by default
    this.formattedSelection = this.formatDate(new Date());
  }

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }

  onSave() {
    this.dialogRef.close(this.selectedDate);
  }

  dateChanged(event) {
    const formattedDate = this.formatDate(event);
    this.formattedSelection = formattedDate;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-us', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  selectedDate: Date | null;
  formattedSelection: string | Date | null;
}
