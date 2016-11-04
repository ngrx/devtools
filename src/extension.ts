import { OpaqueToken, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { share } from 'rxjs/operator/share';
import { switchMap } from 'rxjs/operator/switchMap';
import { takeUntil } from 'rxjs/operator/takeUntil';

import { ActionTypes } from './actions';
import { LiftedState } from './reducer';
import { unliftState, unliftAction, applyOperators } from './utils';

export const ExtensionActionTypes = {
  START: 'START',
  DISPATCH: 'DISPATCH',
  STOP: 'STOP',
  ACTION: 'ACTION'
};

export const REDUX_DEVTOOLS_EXTENSION = new OpaqueToken('Redux Devtools Extension');

export interface ReduxDevtoolsExtensionConnection {
  subscribe(listener: (change: any) => void);
  unsubscribe();
  send(action: any, state: any);
}

export interface ReduxDevtoolsExtension {
  connect(options: { shouldStringify?: boolean, instanceId: string }): ReduxDevtoolsExtensionConnection;
  send(action: any, state: any, shouldStringify?: boolean, instanceId?: string);
}


@Injectable()
export class DevtoolsExtension {
  private instanceId = `ngrx-store-${Date.now()}`;
  private devtoolsExtension: ReduxDevtoolsExtension;

  liftedActions$: Observable<any>;
  actions$: Observable<any>;

  constructor(
    @Inject(REDUX_DEVTOOLS_EXTENSION) devtoolsExtension
  ) {
    this.devtoolsExtension = devtoolsExtension;
    this.createActionStreams();
  }

  notify(action, state: LiftedState) {
    if (!this.devtoolsExtension) {
      return;
    }

    this.devtoolsExtension.send(null, state, false, this.instanceId);
  }

  private createChangesObservable(): Observable<any> {
    if (!this.devtoolsExtension) {
      return empty();
    }

    return new Observable(subscriber => {
      const connection = this.devtoolsExtension.connect({ instanceId: this.instanceId });

      connection.subscribe(change => subscriber.next(change));

      return connection.unsubscribe;
    });
  }

  private createActionStreams() {
    // Listens to all changes based on our instanceId
    const changes$ = share.call(this.createChangesObservable());

    // Listen for the start action
    const start$ = filter.call(changes$, change => change.type === ExtensionActionTypes.START);

    // Listen for the stop action
    const stop$ = filter.call(changes$, change => change.type === ExtensionActionTypes.STOP);

    // Listen for lifted actions
    const liftedActions$ = applyOperators(changes$, [
      [ filter, change => change.type === ExtensionActionTypes.DISPATCH ],
      [ map,  change => this.unwrapAction(change.payload) ]
    ]);

    // Listen for unlifted actions
    const actions$ = applyOperators(changes$, [
      [ filter, change => change.type === ExtensionActionTypes.ACTION ],
      [ map,  change => this.unwrapAction(change.payload) ]
    ]);

    const actionsUntilStop$ = takeUntil.call(actions$, stop$);
    const liftedUntilStop$ = takeUntil.call(liftedActions$, stop$);

    // Only take the action sources between the start/stop events
    this.actions$ = switchMap.call(start$, () => actionsUntilStop$);
    this.liftedActions$ = switchMap.call(start$, () => liftedUntilStop$);
  }

  private unwrapAction(action) {
    return typeof action === 'string' ? eval(`(${action})`) : action;
  }
}
