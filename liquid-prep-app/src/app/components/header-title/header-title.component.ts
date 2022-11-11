import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.scss']
})
export class HeaderTitleComponent implements OnInit {

  @Input() headerTitle : String;
  @Input() leftIconName : String;
  @Input() rightIconName : String

  @Output() click = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(btn:string){
    this.click.emit(btn);
  }

}
