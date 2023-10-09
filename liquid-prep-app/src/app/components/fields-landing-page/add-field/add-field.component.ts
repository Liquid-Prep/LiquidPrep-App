import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})
export class AddFieldComponent implements OnInit {
  headerConfig: HeaderConfig = {
    headerTitle: 'Add Field',
    leftIconName: 'arrow_back',
    rightIconName: 'save',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: this.save.bind(this),
  };

  constructor(
    private headerService: HeaderService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }

  public handleLeftClick(data: string) {
    this.location.back();
  }

  public save() {
    //TODO
    console.log('save');
  }
}
