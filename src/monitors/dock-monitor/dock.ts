import {Component, HostListener, HostBinding, Input} from '@angular/core';
import {PositionsType} from './reducer';


@Component({
  selector: 'ngrx-dock',
  template: `
    <div class="dock">
      <div class="dock-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: all 0.3s;
      z-index: 9999;
    }

    .dock {
      position: absolute;
      z-index: 1;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
      background-color: white;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .dock-content {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  `]
})
export class Dock{
  @Input() position: PositionsType = 'right';
  @Input() size: number = 0.3;
  @Input() visible: boolean = true;

  get absoluteSize(){
    return `${100 * this.size}%`;
  }

  get restSize(){
    return `${100 - (100 * this.size)}%`;
  }

  @HostBinding('style.left') get leftPosition(){
    return this.calculatePosition('left', 'right');
  }

  @HostBinding('style.right') get rightPosition(){
    return this.calculatePosition('right', 'left');
  }

  @HostBinding('style.top') get topPosition(){
    return this.calculatePosition('top', 'bottom');
  }

  @HostBinding('style.bottom') get bottomPosition(){
    return this.calculatePosition('bottom', 'top');
  }

  calculatePosition(primary: PositionsType, secondary: PositionsType) {
    if(this.visible){
      switch (this.position) {
        case secondary:
          return this.restSize;
        default:
          return '0%';
      }
    }
    else {
      switch (this.position) {
        case primary:
          return `-${this.absoluteSize}`;
        case secondary:
          return '100%';
        default:
          return '0%';
      }
    }
  }
}
