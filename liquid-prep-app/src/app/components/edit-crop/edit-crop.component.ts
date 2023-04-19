import { Component, OnInit, Directive, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CropDatePickerComponent } from './crop-date-picker/crop-date-picker.component';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    value = value.replace(/\D+/g, ''); // Remove all non-numeric characters
    if (value.length > 8) {
      value = value.slice(0, 8); // Limit to 8 characters (ddMMyyyy)
    }
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2); // Add a slash after the day
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5); // Add a slash after the month
    }
    this.el.nativeElement.value = value; // Update the input value
  }

}


@Component({
  selector: 'app-edit-crop',
  templateUrl: './edit-crop.component.html',
  styleUrls: ['./edit-crop.component.scss']
})
export class EditCropComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
  }

  public backClicked() {
    this.location.back();
  }

  public onHeaderClick(data: string) {
    if (data == 'leftBtn') {
      this.backClicked();
    } else {
      //TODO
    }
  }

  cropNameValue = 'Custom crop name';
  datePlanted: string;
  isFormDisabled: boolean = true;
  isFormEnabled: boolean = false;
  title: string;

  enableForm() {
    this.isFormDisabled = false;
    this.isFormEnabled = true;
  }

  // Format the selected date as a localized string
  formatInputDate(date: Date): string {
    return date.toLocaleDateString();
  }

  openDialog(title: string): void {
    const dialogRef: MatDialogRef<CropDatePickerComponent> = this.dialog.open(CropDatePickerComponent, {
      width: '100%',
      panelClass: 'date-picker-dialog',
      data: { title: title }
    });

    dialogRef.afterClosed().subscribe((selectedDate: Date) => {
      const inputDate = this.datePipe.transform(selectedDate, 'MM/dd/yyyy');

      if (selectedDate) { // Check if a date was selected
        this.datePlanted = inputDate; // Assign the selected date to the variable
      }
    });
  }

}
