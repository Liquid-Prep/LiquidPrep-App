import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
  encapsulation : ViewEncapsulation.None,
})
export class SelectModalComponent implements OnInit {
  title: string;
  selectedOption: string;
  selectedLabel: string;
  modalTitle: string;
  options: { value: string; label: string }[];

  constructor(
    public dialogRef: MatDialogRef<SelectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedOption = data.selectedOption;
    this.modalTitle = data.modalTitle;
    this.selectedLabel = data.options.find(opt => opt.value === this.selectedOption)?.label || '';
    this.options = data.options;

  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  saveSelection() {
    const selection = {
      selectedOption: this.getValueForSelectOption(this.selectedOption),
      selectedLabel: this.getLabelForSelectOption(this.selectedOption)
    };
    this.dialogRef.close(selection);
  }

  getLabelForSelectOption(option: string): string {
    const selectedOptionData = this.options.find((opt) => opt.value === option);
    return selectedOptionData ? selectedOptionData.label : '';
  }

  getValueForSelectOption(option: string): string {
    const selectedOptionData = this.options.find((opt) => opt.value === option);
    return selectedOptionData ? selectedOptionData.value : '';
  }
}
