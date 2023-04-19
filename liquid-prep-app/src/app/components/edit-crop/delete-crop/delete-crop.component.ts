import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-crop',
  templateUrl: './delete-crop.component.html',
  styleUrls: ['./delete-crop.component.scss'],
})
export class DeleteCropComponent implements OnInit {
  title: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteCropComponent>
  ) {}

  ngOnInit(): void {}

  onRemoveCrop() {
    alert('Crop Deleted');
    this.dialogRef.close('deleted'); // this.cropDataService.deleteMyCrop(crop.id);
  }

  onClose(): void {
    this.dialogRef.close('cancel');
  }
}
