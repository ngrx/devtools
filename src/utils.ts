import { Action } from '@ngrx/store';
import { LiftedState } from './reducer';
import { StoreDevtoolActions } from './actions';

export function difference(first: any[], second: any[]) {
  return first.filter(item => second.indexOf(item) < 0);
}

/**
 * Provides an app's view into the state of the lifted store.
 */
export function unliftState(liftedState: LiftedState) {
  const { computedStates, currentStateIndex } = liftedState;
  const { state } = computedStates[currentStateIndex];

  return state;
}

export function unliftAction(liftedState: LiftedState) {
  return liftedState.actionsById[liftedState.nextActionId - 1];
}

/**
* Lifts an app's action into an action on the lifted store.
*/
export function liftAction(action) {
  return StoreDevtoolActions.performAction(action);
}
