import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-crop',
  templateUrl: './delete-crop.component.html',
  styleUrls: ['./delete-crop.component.scss'],
})
export class DeleteCropComponent implements OnInit {
  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();
  title: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteCropComponent>
  ) {}

  ngOnInit(): void {}

  onDeleteCrop() {
    this.onDelete.emit();
    this.dialogRef.close('deleted');
  }

  onClose(): void {
    this.dialogRef.close('cancel');
  }
}
