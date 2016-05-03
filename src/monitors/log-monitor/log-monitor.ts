import {Inject, Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {StoreDevtools} from '../../store/devtools';
import {LogEntryItem} from './log-entry-item';
import {LogMonitorEntry} from './log-monitor-entry';
import {LogMonitorButton} from './log-monitor-button';

@Component({
  selector: 'log-monitor',
  directives: [LogMonitorEntry, LogMonitorButton],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      display: block;
      background-color: #2A2F3A;
      font-family: 'monaco', 'Consolas', 'Lucida Console', monospace;
      position: relative;
      overflow-y: hidden;
      width: 100%;
      height: 100%;
      min-width: 300px;
      direction: ltr;
    }

    .button-bar{
      text-align: center;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-color: transparent;
      z-index: 1;
      display: flex;
      flex-direction: row;
      padding: 0 4px;
    }

    .elements{
      position: absolute;
      left: 0;
      right: 0;
      top: 38px;
      bottom: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
  `],
  template: `
    <div class="button-bar">
      <log-monitor-button (action)="handleReset()" [disabled]="canReset$ | async">
        Reset
      </log-monitor-button>

      <log-monitor-button (action)="handleRollback()">
        Revert
      </log-monitor-button>

      <log-monitor-button (action)="handleSweep()" [disabled]="canSweep$ | async">
        Sweep
      </log-monitor-button>

      <log-monitor-button (action)="handleCommit()" [disabled]="canCommit$ | async">
        Commit
      </log-monitor-button>
    </div>
    <div class="elements">
      <log-monitor-entry
        *ngFor="let item of (items$ | async)"
        [item]="item"
        (toggle)="handleToggle($event.id)">
      </log-monitor-entry>
    </div>
  `
})
export class LogMonitor{
  private items$: Observable<LogEntryItem[]>;
  private canRevert$ = this.devtools.liftedState.map(s => !(s.computedStates.length > 1));
  private canSweep$: Observable<boolean>;
  private canCommit$: Observable<boolean>;

  constructor(private devtools: StoreDevtools){
    this.canRevert$ =
    this.canSweep$ = devtools.liftedState.map(s => !(s.skippedActionIds.length > 0));
    this.canCommit$ = devtools.liftedState.map(s => !(s.computedStates.length > 1));

    this.items$ = devtools.liftedState
      .map(({ actionsById, skippedActionIds, stagedActionIds, computedStates }) => {
        const actions = [];

        for (let i = 0; i < stagedActionIds.length; i++){
          const actionId = stagedActionIds[i];
          const action = actionsById[actionId].action;
          const { state, error } = computedStates[i];
          let previousState;
          if (i > 0) {
            previousState = computedStates[i - 1].state;
          }

          actions.push({
            key: actionId,
            collapsed: skippedActionIds.indexOf(actionId) > -1,
            action,
            actionId,
            state,
            previousState,
            error
          });
        }

        return actions.slice(1);
      });
  }

  handleToggle(id: number){
    this.devtools.toggleAction(id);
  }

  handleReset(){
    this.devtools.reset();
  }

  handleRollback(){
    this.devtools.rollback();
  }

  handleSweep(){
    this.devtools.sweep();
  }

  handleCommit(){
    this.devtools.commit();
  }
}
