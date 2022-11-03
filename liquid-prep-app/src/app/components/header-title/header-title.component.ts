import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.scss']
})
export class HeaderTitleComponent implements OnInit {

  @Input() headerTitle : String;
  @Input() leftIconName : String;
  @Input() rightIconName : String
  location: any;

  constructor() { }

  ngOnInit(): void {
  }

  public volumeClicked() {

  }

  public backClicked() {
    this.location.back();
  }

}
