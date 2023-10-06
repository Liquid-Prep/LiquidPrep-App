import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  headerConfig: HeaderConfig = {
    headerTitle: 'Field Details',
    leftIconName: 'close',
    rightIconName: 'delete',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: null,
  };

  constructor(
    private headerService: HeaderService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }

  public handleLeftClick() {
    this.backToMyFields();
  }

  backToMyFields() {
    this.location.back();
  }
}
