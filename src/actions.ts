export const ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  SET_ACTIONS_ACTIVE: 'SET_ACTIONS_ACTIVE',
  JUMP_TO_STATE: 'JUMP_TO_STATE',
  IMPORT_STATE: 'IMPORT_STATE'
};

/**
* Action creators to change the History state.
*/
export const StoreDevtoolActions = {
  performAction(action) {
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      );
    }

    return { type: ActionTypes.PERFORM_ACTION, action, timestamp: Date.now() };
  },

  reset() {
    return { type: ActionTypes.RESET, timestamp: Date.now() };
  },

  rollback() {
    return { type: ActionTypes.ROLLBACK, timestamp: Date.now() };
  },

  commit() {
    return { type: ActionTypes.COMMIT, timestamp: Date.now() };
  },

  sweep() {
    return { type: ActionTypes.SWEEP };
  },

  toggleAction(id) {
    return { type: ActionTypes.TOGGLE_ACTION, id };
  },

  setActionsActive(start, end, active = true) {
    return { type: ActionTypes.SET_ACTIONS_ACTIVE, start, end, active };
  },

  jumpToState(index) {
    return { type: ActionTypes.JUMP_TO_STATE, index };
  },

  importState(nextLiftedState) {
    return { type: ActionTypes.IMPORT_STATE, nextLiftedState };
  }
};
