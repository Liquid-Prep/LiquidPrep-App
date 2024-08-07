import { Component, OnInit } from '@angular/core';
import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-connecting-dialog',
  templateUrl: './connecting-dialog.component.html',
  styleUrls: ['./connecting-dialog.component.scss']
})
export class ConnectingDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConnectingDialogComponent>) {

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
    });

    dialogRef.afterOpened().subscribe(_ => {
      setTimeout(() => {
        dialogRef.close();
      }, 10000);
    });
  }

  ngOnInit(): void {
  }
}
