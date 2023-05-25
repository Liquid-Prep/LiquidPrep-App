import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/service/header.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    private headerService: HeaderService
    ) { }

  ngOnInit(): void {
    this.headerService.updateHeader(
      'Settings',   // headerTitle
      'arrow_back', // leftIconName
      'volume_up',   // rightIconName
      this.handleLeftClick.bind(this),  // leftBtnClick
      null,          // rightBtnClick
    );
  }

  public volumeClicked() {
    this.router.navigateByUrl('/my-crops');
  }

  public backClicked() {
    this.location.back();
  }

  public handleLeftClick(data:string){
    this.backClicked();
  }

  // public onHeaderClick(data:string){
  //   if(data == 'leftBtn'){
  //     this.backClicked();
  //   }else {
  //     //TODO
  //   }
  // }
}
