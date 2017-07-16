import { Injectable, Inject, OnDestroy } from '@angular/core';
import { State, INITIAL_STATE, INITIAL_REDUCER, Dispatcher, Reducer } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operator/map';
import { merge } from 'rxjs/operator/merge';
import { observeOn } from 'rxjs/operator/observeOn';
import { scan } from 'rxjs/operator/scan';
import { skip } from 'rxjs/operator/skip';
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';
import { queue } from 'rxjs/scheduler/queue';

import { DevtoolsExtension } from './extension';
import { liftAction, unliftState, applyOperators } from './utils';
import { liftReducerWith, liftInitialState, LiftedState } from './reducer';
import { StoreDevtoolActions as actions } from './actions';
import { StoreDevtoolsConfig, STORE_DEVTOOLS_CONFIG } from './config';

@Injectable()
export class DevtoolsDispatcher extends Dispatcher { }

@Injectable()
export class StoreDevtools implements Observer<any> {
  private stateSubscription: Subscription;
  public dispatcher: Dispatcher;
  public liftedState: Observable<LiftedState>;
  public state: Observable<any>;

  constructor(
    dispatcher: DevtoolsDispatcher,
    actions$: Dispatcher,
    reducers$: Reducer,
    extension: DevtoolsExtension,
    @Inject(INITIAL_STATE) initialState: any,
    @Inject(STORE_DEVTOOLS_CONFIG) config: StoreDevtoolsConfig
  ) {
    const liftedInitialState = liftInitialState(initialState, config.monitor);
    const liftReducer = liftReducerWith(initialState, liftedInitialState, config.monitor, {
      maxAge: config.maxAge
    });

    const liftedAction$ = applyOperators(actions$, [
      [ skip, 1 ],
      [ merge, extension.actions$ ],
      [ map, liftAction ],
      [ merge, dispatcher, extension.liftedActions$ ],
      [ observeOn, queue ]
    ]);

    const liftedReducer$ = map.call(reducers$, liftReducer);

    const liftedStateSubject = new ReplaySubject<LiftedState>(1);
    const liftedStateSubscription = applyOperators(liftedAction$, [
      [ withLatestFrom, liftedReducer$ ],
      [ scan, (liftedState, [ action, reducer ]) => {
        const nextState = reducer(liftedState, action);

        extension.notify(action, nextState);

        return nextState;
      }, liftedInitialState]
    ]).subscribe(liftedStateSubject);

    const liftedState$ = liftedStateSubject.asObservable();
    const state$ = map.call(liftedState$, unliftState);

    this.stateSubscription = liftedStateSubscription;
    this.dispatcher = dispatcher;
    this.liftedState = liftedState$;
    this.state = state$;
  }

  dispatch(action) {
    this.dispatcher.dispatch(action);
  }

  next(action: any) {
    this.dispatcher.dispatch(action);
  }

  error(error: any) { }

  complete() { }

  performAction(action: any) {
    this.dispatch(actions.performAction(action));
  }

  reset() {
    this.dispatch(actions.reset());
  }

  rollback() {
    this.dispatch(actions.rollback());
  }

  commit() {
    this.dispatch(actions.commit());
  }

  sweep() {
    this.dispatch(actions.sweep());
  }

  toggleAction(id: number) {
    this.dispatch(actions.toggleAction(id));
  }

  jumpToState(index: number) {
    this.dispatch(actions.jumpToState(index));
  }

  importState(nextLiftedState: any) {
    this.dispatch(actions.importState(nextLiftedState));
  }
}
