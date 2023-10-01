import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  public location;

  public waterFields = [
    {
      name: "South West Field 1",
      type: "Corn",
      water: false
    },
    {
      name: "South West Field 2",
      type: "Corn",
      water: false
    },
    {
      name: "South West Field 3",
      type: "Corn",
      water: false
    }
  ]

  public wateredFields = [
    {
      name: "North West Field 1",
      type: "Corn",
      water: false
    },
    {
      name: "North West Field 2",
      type: "Corn",
      water: false
    },
    {
      name: "North West Field 3",
      type: "Corn",
      water: false
    }
  ]

  headerConfig: HeaderConfig = {
    headerTitle: 'Fields',
    leftIconName: 'menu',
    rightIconName: 'search',
    leftBtnClick: null,
    rightBtnClick: this.toggleSearch.bind(this),
  };

  constructor(
    private headerService: HeaderService,
  ) {}
  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }

  public onHeaderClick(data: string) {
    console.log(data);
    if (data == 'leftBtn') {
      this.backClicked();
    } else {
      // TODO
    }
  }

  public toggleSearch() {
    console.log("SDADSA");
  }

  public backClicked() {
    this.location.back();
  }

}
