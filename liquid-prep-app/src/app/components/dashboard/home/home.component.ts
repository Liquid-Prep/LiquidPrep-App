import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  headerConfig: HeaderConfig = {
    headerTitle: 'Liquid Prep',
    leftIconName: 'menu',
    rightIconName: 'cached',
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
