import {provide, Provider, OpaqueToken} from '@angular/core';
import * as store from '@ngrx/store';

import {StoreDevtools} from './devtools';
import {dockReducer} from '../monitors/dock-monitor/reducer';

const MONITOR_REDUCER = new OpaqueToken('@ngrx/devtools/store/monitor-reducer');

export function instrumentStore(_monitorReducer: any = { dock: dockReducer }) {
  const reducer = typeof _monitorReducer === 'function'
    ? _monitorReducer
    : store.combineReducers(_monitorReducer);

  return [
    provide(store.StoreBackend, {
      deps: [
        store.REDUCER,
        store.Dispatcher,
        store.INITIAL_STATE,
        store.RESOLVED_PRE_MIDDLEWARE,
        store.RESOLVED_POST_MIDDLEWARE,
        MONITOR_REDUCER
      ],
      useFactory(reducer, dispatcher, initialState, preMiddleware, postMiddleware, monitorReducer) {
        return new StoreDevtools(
          reducer,
          dispatcher,
          initialState,
          preMiddleware,
          postMiddleware,
          monitorReducer
        );
      }
    }),
    provide(StoreDevtools, { useExisting: store.StoreBackend }),
    provide(MONITOR_REDUCER, { useValue: reducer })
  ];
}
