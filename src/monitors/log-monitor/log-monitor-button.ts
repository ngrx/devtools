import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  HostListener,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'log-monitor-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host{
      flex-grow: 1;
      display: inline-block;
      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;
      cursor: pointer;
      font-weight: bold;
      border-radius: 3px;
      padding: 4px 8px;
      margin: 5px 3px 5px 3px;
      font-size: 0.8em;
      color: white;
      text-decoration: none;
      background-color: #4F5A65;
    }

    :host.disabled{
      opacity: 0.2;
      cursor: text;
      background-color: transparent;
    }
  `]
})
export class LogMonitorButton{
  @HostBinding('class.disabled') @Input() disabled: boolean;
  @Output() action = new EventEmitter();

  @HostListener('click', ['$event']) handleAction($event){
    if(!this.disabled){
      this.action.next({});
    }
    $event.stopPropagation();
    return false;
  }
}
