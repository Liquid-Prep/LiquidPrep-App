import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Welcome to liquid-prep-app';
  headerTitle = 'Liquid Prep';
  leftIconName = 'menu';
  leftBtnClick = '/menu';
  rightIconName = 'settings';
  rightBtnClick = '/settings';


  constructor( private swUpdate: SwUpdate, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.
      addSvgIcon('rain_drop',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/test-sensor/rain-drop.svg') ).
      addSvgIcon('soil_moisture',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/test-sensor/soil-moisture-field.svg') ).
      addSvgIcon('windy_strong',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/test-sensor/windy-strong.svg') );
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available, would like to update?')) {
          window.location.reload();
        }
      });
    }
  }
}
