import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { SoilMoistureService } from '../../service/SoilMoistureService';
import { SoilMoisture } from '../../models/SoilMoisture';


@Component({
  selector: 'app-past-readings',
  templateUrl: './past-readings.component.html',
  styleUrls: ['./past-readings.component.scss'],
})
export class PastReadingsComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
    private soilService: SoilMoistureService
  ) {}

  ngOnInit(): void {}

  selected: Date | null;
  public soilData: SoilMoisture;
  public soilMoistureColorClass = 'color-high';
  public soilMoistureIndexColorMap = new Map([
    ['LOW', 'color-low'],
    ['MEDIUM', 'color-medium'],
    ['HIGH', 'color-high'],
  ]);

  public volumeClicked() {
    this.router.navigateByUrl('/my-crops');
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

  selectedDateHasReadingClass = (date: Date): MatCalendarCellCssClasses => {
    this.soilData = this.soilService.getSoilMoistureReading();
    this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(
      this.soilData.soilMoistureIndex
    );

    const highMoistureReadingDates: number[] = [15]; // Dates that have a high reading
    const mediumMoistureReadingDates: number[] = [3, 4, 7, 11, 17, 20, 25]; // Dates that have a medium reading
    const lowMoistureReadingDates: number[] = []; // Dates that have a low reading

    // Apply soil moisture indicator class for days that have readings
    if (highMoistureReadingDates.includes(date.getDate())) {
      return 'has-reading color-high';
    } else if (mediumMoistureReadingDates.includes(date.getDate())) {
      return 'has-reading color-medium';
    } else if (lowMoistureReadingDates.includes(date.getDate())) {
      return 'has-reading color-low';
    } else {
      ('has-reading');
    }
  };
}
