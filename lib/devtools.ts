import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/observeOn';

import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { queue } from 'rxjs/scheduler/queue';
import { Dispatcher, Reducer } from '@ngrx/store';

import { liftReducerWith, liftInitialState, LiftedState } from './reducer';
import { StoreDevtoolActions as actions } from './actions';
import { liftAction, unliftState } from './utils';
import { Options } from './config';
import { Extension } from './extension';

export class DevtoolsDispatcher extends Dispatcher { }

export class StoreDevtools implements Observer<any> {
  public dispatcher: Dispatcher;
  public liftedState: Observable<LiftedState>;
  public state: Observable<any>;

  constructor(
    dispatcher: DevtoolsDispatcher,
    actions$: Dispatcher,
    reducers$: Reducer,
    initialState: any,
    options: Options,
    extension: Extension
  ) {
    const liftedInitialState = liftInitialState(initialState, options.monitor);
    const liftReducer = liftReducerWith(initialState, liftedInitialState, options.monitor, {
      maxAge: options.maxAge
    });

    const liftedActions$ = actions$
      .skip(1)
      .merge(extension.actions$)
      .map(liftAction)
      .merge(dispatcher, extension.liftedActions$)
      .observeOn(queue);

    const liftedReducers$ = reducers$
      .map(liftReducer);

    const liftedState = liftedActions$
      .withLatestFrom(liftedReducers$)
      .scan((liftedState, [ action, reducer ]) => {
        const nextState = reducer(liftedState, action);

        extension.notify(action, nextState);

        return nextState;
      }, liftedInitialState)
      .publishReplay(1)
      .refCount();

    const state = liftedState
      .map(unliftState);

    this.dispatcher = dispatcher;
    this.liftedState = liftedState;
    this.state = state;
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
