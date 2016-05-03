import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import {StoreDevtools} from '../../store/devtools';
import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {DockState} from './reducer';
import {Commander} from './commander';
import {Dock} from './dock';
import {DockActions} from './actions';


@Component({
  selector: 'dock-monitor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [ Dock, Commander ],
  providers: [ DockActions ],
  template: `
    <ngrx-commander [shortcut]="toggleCommand" (command)="toggle$.next($event)"></ngrx-commander>
    <ngrx-commander [shortcut]="positionCommand" (command)="changePosition$.next($event)"></ngrx-commander>

    <ngrx-dock
      [visible]="visible$ | async"
      [position]="position$ | async"
      [size]="size$ | async">
      <ng-content></ng-content>
    </ngrx-dock>
  `
})
export class DockMonitor {
  @Input() toggleCommand: string;
  @Input() positionCommand: string;

  constructor(
    private tools: StoreDevtools,
    private actions: DockActions
  ){
    Observable
      .merge(this.toggleAction$, this.positionAction$)
      .subscribe(this.tools);
  }

  private state$ = this.tools.liftedState.map<DockState>(s => s.monitorState.dock);
  private visible$ = this.state$.map(s => s.visible).distinctUntilChanged();
  private position$ = this.state$.map(s => s.position).distinctUntilChanged();
  private size$ = this.state$.map(s => s.size).distinctUntilChanged();

  private toggle$ = new Subject();
  private toggleAction$ = this.toggle$
    .map(() => this.actions.toggleVisibility());

  private changePosition$ = new Subject();
  private positionAction$ = this.changePosition$
    .map(() => this.actions.changePosition());
}
