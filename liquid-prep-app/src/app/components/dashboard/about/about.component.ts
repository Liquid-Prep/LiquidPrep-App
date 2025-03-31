import { Component, OnInit } from '@angular/core';
import { HeaderConfig, HeaderService } from 'src/app/service/header.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
 headerConfig: HeaderConfig = {
    headerTitle: 'About Liquid Prep',
    leftIconName: 'menu',
    leftBtnClick: null,
  };

  constructor(private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }

}
