import { StoreModule, State, INITIAL_STATE, INITIAL_REDUCER, Dispatcher, Reducer } from '@ngrx/store';
import { NgModule, OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoreDevtools, DevtoolsDispatcher } from './devtools';
import { StoreDevtoolsConfig, STORE_DEVTOOLS_CONFIG } from './config';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION } from './extension';


export function _createReduxDevtoolsExtension() {
  if (typeof window !== 'undefined' && (window as any).devToolsExtension) {
    return (window as any).devtoolsExtension;
  }

  return null;
}

export function _createState(devtools: StoreDevtools) {
  return devtools.state;
}

export function _createReducer(dispatcher: DevtoolsDispatcher, reducer) {
  return new Reducer(dispatcher, reducer);
}

@NgModule({
  imports: [
    StoreModule
  ],
  providers: [
    DevtoolsExtension,
    DevtoolsDispatcher,
    StoreDevtools,
    {
      provide: REDUX_DEVTOOLS_EXTENSION,
      useFactory: _createReduxDevtoolsExtension
    }
  ]
})
export class StoreDevtoolsModule {
  static instrumentStore(_options: StoreDevtoolsConfig = {}) {
    const DEFAULT_OPTIONS: StoreDevtoolsConfig = {
      monitor: () => null
    };

    const options = Object.assign({}, DEFAULT_OPTIONS, _options);

    if (options.maxAge && options.maxAge < 2) {
      throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${options.maxAge}`);
    }

    return {
      ngModule: StoreDevtoolsModule,
      providers: [
        {
          provide: State,
          deps: [ StoreDevtools ],
          useFactory: _createState
        },
        {
          provide: Reducer,
          deps: [ DevtoolsDispatcher, INITIAL_REDUCER ],
          useFactory: _createReducer
        },
        { provide: STORE_DEVTOOLS_CONFIG, useValue: options }
      ]
    };
  }
}
