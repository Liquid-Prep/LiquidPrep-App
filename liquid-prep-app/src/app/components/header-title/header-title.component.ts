import { Component, ViewEncapsulation, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.scss'],
  encapsulation : ViewEncapsulation.None,

})
export class HeaderTitleComponent implements OnInit {
  @Output() click = new EventEmitter<string>();
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(public headerService: HeaderService) { }

  ngOnInit(): void {
  }

  onClick(btn: string) {
    if (btn === 'leftBtn') {
      this.openSidenav();
    } else {
      this.click.emit(btn);
    }
  }

  openSidenav() {
    this.sidenavToggle.emit();
  }

  handleLeftBtnClick(): void {
    const leftBtnClickFn = this.headerService.headerConfig.leftBtnClick;

    if (leftBtnClickFn && typeof leftBtnClickFn === 'function') {
      leftBtnClickFn();
    } else {
      this.openSidenav();
    }
  }
}
