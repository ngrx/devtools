import {Component, Input} from '@angular/core';
import {LogMonitor} from './log-monitor/log-monitor';
import {DockMonitor} from './dock-monitor/dock-monitor';

@Component({
  selector: 'ngrx-devtools',
  directives: [ LogMonitor, DockMonitor ],
  template: `
    <dock-monitor [toggleCommand]="toggleCommand" [positionCommand]="positionCommand">
      <log-monitor></log-monitor>
    </dock-monitor>
  `
})
export class Devtools{
  @Input('toggle-command') toggleCommand: string = 'ctrl-h';
  @Input('position-command') positionCommand: string = 'ctrl-m';
}
