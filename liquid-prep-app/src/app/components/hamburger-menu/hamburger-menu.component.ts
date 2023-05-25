import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss']
})
export class HamburgerMenuComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() closeSidenav = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }
  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  triggerCloseSidenav() {
    this.closeSidenav.emit();
  }
}
