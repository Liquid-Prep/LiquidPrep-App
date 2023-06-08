import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';


@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.scss']
})
export class HeaderTitleComponent implements OnInit {
  @Output() click = new EventEmitter<string>();
  @Output() sidenavToggle = new EventEmitter<void>();

  headerTitle = '';
  leftIconName = 'menu';
  rightIconName = 'volume_up';


  constructor(
    public headerService: HeaderService
  ) { }

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
    const leftBtnClickFn = this.headerService.leftBtnClick;

    if (leftBtnClickFn && typeof leftBtnClickFn === 'function') {
      leftBtnClickFn();
    } else {
      this.openSidenav();
    }
  }

}
