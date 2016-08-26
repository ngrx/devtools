import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { OpaqueToken, Inject, Injectable } from '@angular/core';

import { ActionTypes } from './actions';
import { unliftState, unliftAction } from './utils';
import { LiftedState } from './reducer';

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
    if (!this.devtoolsExtension || action.type !== ActionTypes.PERFORM_ACTION) {
      return;
    }

    this.devtoolsExtension.send(unliftAction(state), unliftState(state), false, this.instanceId);
    this.devtoolsExtension.send(null, state, false, this.instanceId);
  }

  private createChangesObservable(): Observable<any> {
    if (!this.devtoolsExtension) {
      return Observable.empty();
    }

    return new Observable(subscriber => {
      const connection = this.devtoolsExtension.connect({ instanceId: this.instanceId });

      connection.subscribe(change => subscriber.next(change));

      return connection.unsubscribe();
    });
  }

  private createActionStreams() {
    // Listens to all changes based on our instanceId
    const changes$ = this.createChangesObservable().share();

    // Listen for the start action
    const start$ = changes$
      .filter(change => change.type === ExtensionActionTypes.START);

    // Listen for the stop action
    const stop$ = changes$
      .filter(change => change.type === ExtensionActionTypes.STOP);

    // Listen for lifted actions
    const liftedActions$ = changes$
      .filter(change => change.type === ExtensionActionTypes.DISPATCH)
      .map(change => change.payload);
      // .filter(action => action.type !== 'JUMP_TO_STATE');

    // Listen for unlifted actions
    const actions$ = changes$
      .filter(change => change.type === ExtensionActionTypes.DISPATCH)
      .map(change => change.payload);

    // Only take the action sources between the start/stop events
    this.actions$ = start$.switchMapTo(actions$.takeUntil(stop$));
    this.liftedActions$ = start$.switchMapTo(liftedActions$.takeUntil(stop$));
  }
}
