import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  headerConfig: HeaderConfig = {
    headerTitle: 'Settings',
    leftIconName: 'arrow_back',
    rightIconName: 'volume_up',
    leftBtnClick: this.backClicked.bind(this),
    rightBtnClick: null,
  };

  constructor(
    private router: Router,
    private location: Location,
    private headerService: HeaderService
    ) { }

  public volumeClicked() {
    this.router.navigateByUrl('/my-crops');
  }

  public backClicked() {
    this.location.back();
  }

  public onHeaderClick(data:string){
    this.backClicked();
  }

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }
}
