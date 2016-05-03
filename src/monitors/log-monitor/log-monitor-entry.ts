import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

import {LogEntryItem} from './log-entry-item';
import {LogMonitorButton} from './log-monitor-button';

@Component({
  selector: 'log-monitor-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [LogMonitorButton],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div class="title-bar" [ngClass]="{ collapsed: item.collapsed }">
      {{ item.action.type }}
    </div>
    <div class="action-bar" *ngIf="!item.collapsed">
      <log-monitor-button (action)="logPayload($event)">
        Log Payload
      </log-monitor-button>
      <log-monitor-button (action)="logState($event)">
        Log State
      </log-monitor-button>
    </div>
  `,
  styles: [`
    :host{
      color: #FFFFFF;
      background-color: #4F5A65;
      cursor: pointer;
    }
    .title-bar{
      padding: 8px 0 7px 16px;
      background-color: rgba(0,0,0,0.1);
    }
    .action-bar{
      padding: 8px 0 7px;
      text-align: center;
    }
    .collapsed{
      text-decoration: line-through;
      font-style: italic;
      opacity: 0.5;
    }
    log-monitor-button{
      opacity: 0.6;
    }
  `]
})
export class LogMonitorEntry{
  @Input() item: LogEntryItem;
  @Output() toggle = new EventEmitter();

  @HostListener('click') handleToggle(){
    this.toggle.next({ id: this.item.actionId });
  }

  logPayload(){
    console.log(this.item.action);
  }

  logState(){
    console.log(this.item.state);
  }
}
