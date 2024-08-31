import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Field} from "../../../models/Field";

@Component({
  selector: 'app-water-confirm-dialog',
  templateUrl: './water-confirm-dialog.component.html',
  styles: [
    `
      .dialog-buttons {
        display: flex;
        justify-content: right;
        color: blue;
      }
    `
  ]
})
export class WaterConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { field: Field }) { }

  ngOnInit(): void {
  }

}
