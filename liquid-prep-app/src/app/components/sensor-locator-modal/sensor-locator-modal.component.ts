import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { GeoLocationUtil } from '../../utility/GeoLocationUtil';

@Component({
  selector: 'app-sensor-locator-modal',
  templateUrl: './sensor-locator-modal.component.html',
  styleUrls: ['./sensor-locator-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SensorLocatorModalComponent implements OnInit {
  title: string;
  showStep1 = true;
  showStep2 = false;
  latitude: number;
  longitude: number;
  geocode: string;

  public requestingLocation = false;
  public locationFound = false;
  public errorMessage: string;

  constructor(
    private router: Router,
    private geoLocationUtil: GeoLocationUtil,
    public dialogRef: MatDialogRef<SensorLocatorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.geocode = data.geocode;
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  saveSelection() {
    this.dialogRef.close(this.geocode);
  }

  requestLocation() {
    this.showStep1 = false;
    this.showStep2 = true;
    this.requestingLocation = true;


    setTimeout(() => {
      this.geoLocationUtil.getCurrentLocation().subscribe({
        next: (location) => {
          this.requestingLocation = false;
          this.locationFound = true;
          this.geocode = location;
        },
        error: (err) => {
          const msg = `No location found. Please check that your phone's location services are turned on. \n${err.message}.`;
          this.requestingLocation = false;
          this.locationFound = false;
          this.errorMessage = msg;
        },
      });
    }, 50);
  }

}
