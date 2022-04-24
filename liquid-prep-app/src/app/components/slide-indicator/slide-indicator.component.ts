import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

class Indicator {
  constructor(public ref: number) {}
}

@Component({
  selector: 'app-slide-indicator',
  templateUrl: './slide-indicator.component.html',
  styleUrls: ['./slide-indicator.component.scss']
})
export class SlideIndicatorComponent implements OnInit, OnChanges{

  @Input() public current: number;
  @Input() public length: number;
  public indicators: Indicator[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const lengthChanged = changes.length;
    if (lengthChanged){
      for (let i = 0; i < lengthChanged.currentValue; i++) {
        this.indicators.push(new Indicator(i));
      }
    }
    const curChanged = changes.current;
    if (curChanged) {
    }
  }

  public getIndicatorClass(ref: number): string {
    if (ref === this.current){
      return 'active';
    }else {
      return 'inactive';
    }
  }
}
