import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fields-landing-page',
  templateUrl: './fields-landing-page.component.html',
  styleUrls: ['./fields-landing-page.component.scss'],
})
export class FieldsLandingPageComponent implements OnInit {
  headerConfig: HeaderConfig = {
    headerTitle: 'Fields',
    leftIconName: 'menu',
    rightIconName: 'cached',
    leftBtnClick: null,
    rightBtnClick: null
  };

  fields = [
    {
      id: '901802af-8889-497c-a3bf-ec7c3c6b2396',
      name: 'North Field 1',
      type: 'corn',
      sensors: 4,
      description: 'Crop Rotation',
      soilType: 'Sandy Clay Loam',
      photo: 'assets/crops-images/corn.png',
    },
    {
      id: '3ac555fb-5826-4ebc-92a3-d7d8e73da826',
      name: 'Southwest Field 1',
      type: 'wheat',
      sensors: 1,
      description: 'Crop Rotation',
      soilType: 'Sandy Clay Loam',
      photo: 'assets/crops-images/wheat.png',
    },
    {
      id: '8cdf5b1b-7249-44f2-950e-db07de4fe924',
      name: 'West Field 1',
      type: 'cotton',
      sensors: 2,
      description: 'Crop Rotation',
      soilType: 'Sandy Clay Loam',
      photo: 'assets/crops-images/cotton.png',
    },
    {
      id: '1e1ea10c-d658-4437-9bdb-1c3786f7e966',
      name: 'South Field 1',
      type: 'corn',
      sensors: 3,
      description: 'Crop Rotation',
      soilType: 'Sandy Clay Loam',
      photo: 'assets/crops-images/corn.png',
    },
  ];

  constructor(
    private headerService: HeaderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }

  public onFieldClick(id: string) {
    console.log(id);
    this.router.navigateByUrl(`details/${id}`);
  }

  public addField() {
    console.log("Add Field")
  }
}
