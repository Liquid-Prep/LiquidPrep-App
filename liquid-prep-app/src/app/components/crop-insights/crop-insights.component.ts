import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crop-insights',
  templateUrl: './crop-insights.component.html',
  styleUrls: ['./crop-insights.component.scss']
})
export class CropInsightsComponent implements OnInit {

  constructor(
    private headerService: HeaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.headerService.updateHeader(
      'Crop Insights',   // headerTitle
      'arrow_back',       // leftIconName
      'volume_up',  // rightIconName
      undefined,    // leftBtnClick
      undefined,    // rightBtnClick
    );
  }

  goToPastReadings() {
    console.log('Past Readings');
    this.router.navigate(['/', 'past-readings']);
  }

  goToSensorPage() {
    this.router.navigate(['/', 'test-sensor']);
  }

}
