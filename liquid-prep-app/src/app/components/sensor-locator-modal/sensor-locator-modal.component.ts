import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
          this.geocode = location;
        },
        error: (err) => {
          const msg = `Geolocation not found because \n${err.message}`;
          alert(msg); // TODO: replace with LP designed alert message
          this.requestingLocation = false;
        },
      });
    }, 100);
  }

}
