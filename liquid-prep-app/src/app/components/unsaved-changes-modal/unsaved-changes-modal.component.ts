import { Component, ViewEncapsulation, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-unsaved-changes-modal',
  templateUrl: './unsaved-changes-modal.component.html',
  styleUrls: ['./unsaved-changes-modal.component.scss'],
  encapsulation : ViewEncapsulation.None,
})
export class UnsavedChangesModalComponent implements OnInit {
  title: string;
  sensorId: string;
  backLinkUrl: string;

  constructor(
    private router: Router,
    private location: Location,
    public dialogRef: MatDialogRef<UnsavedChangesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.backLinkUrl = data.backLinkUrl;
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  public backBrowserClicked() {
    this.location.back();
  }

  backClicked() {
    const backLinkUrl = this.backLinkUrl;
    if (backLinkUrl) {
      this.router.navigate([backLinkUrl]);
    } else {
      this.backBrowserClicked();
    }
    this.onCancel();
  }

}

