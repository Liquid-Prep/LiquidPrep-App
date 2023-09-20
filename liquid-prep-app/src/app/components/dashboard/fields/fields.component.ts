import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  headerConfig: HeaderConfig = {
    headerTitle: 'Fields',
    leftIconName: 'menu',
    rightIconName: 'search',
    leftBtnClick: null,
    rightBtnClick: null,
  };

  constructor(
    private headerService: HeaderService,
  ) {}
  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }

}
