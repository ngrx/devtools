import { NgModule, OpaqueToken, Injector, ModuleWithProviders } from '@angular/core';
import { StoreModule, State, INITIAL_STATE, INITIAL_REDUCER, Dispatcher, Reducer } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { StoreDevtools, DevtoolsDispatcher } from './devtools';
import { StoreDevtoolsConfig, STORE_DEVTOOLS_CONFIG } from './config';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION } from './extension';


export function _createReduxDevtoolsExtension() {
  const legacyExtensionKey = 'devToolsExtension';
  const extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';

  if (typeof window === 'object' && typeof window[legacyExtensionKey] !== 'undefined') {
    return window[legacyExtensionKey];
  }
  else if (typeof window === 'object' && typeof window[extensionKey] !== 'undefined') {
    return window[extensionKey];
  }
  else {
    return null;
  }
}

export function _createState(devtools: StoreDevtools) {
  return devtools.state;
}

export function _createReducer(dispatcher: DevtoolsDispatcher, reducer) {
  return new Reducer(dispatcher, reducer);
}

export function _createStateIfExtension(extension: any, injector: Injector) {
  if (!!extension) {
    const devtools: StoreDevtools = injector.get(StoreDevtools);

    return _createState(devtools);
  }
  else {
    const initialState: any = injector.get(INITIAL_STATE);
    const dispatcher: Dispatcher = injector.get(Dispatcher);
    const reducer: Reducer = injector.get(Reducer);

    return new State(initialState, dispatcher, reducer);
  }
}

export function _createReducerIfExtension(extension: any, injector: Injector) {
  if (!!extension) {
    const devtoolsDispatcher: DevtoolsDispatcher = injector.get(DevtoolsDispatcher);
    const reducer: any = injector.get(INITIAL_REDUCER);

    return _createReducer(devtoolsDispatcher, reducer);
  }
  else {
    const dispatcher: Dispatcher = injector.get(Dispatcher);
    const reducer: any = injector.get(INITIAL_REDUCER);

    return new Reducer(dispatcher, reducer);
  }
}

export function _createExtensionOptions(): StoreDevtoolsConfig {
  return {
    maxAge: Infinity,
    monitor: function() {
      return null;
    }
  };
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
      monitor: function() {
        return null;
      }
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

  static instrumentOnlyWithExtension(): ModuleWithProviders {
    return {
      ngModule: StoreDevtoolsModule,
      providers: [
        {
          provide: State,
          deps: [ REDUX_DEVTOOLS_EXTENSION, Injector ],
          useFactory: _createStateIfExtension
        },
        {
          provide: Reducer,
          deps: [ REDUX_DEVTOOLS_EXTENSION, Injector ],
          useFactory: _createReducerIfExtension
        },
        {
          provide: STORE_DEVTOOLS_CONFIG,
          useFactory: _createExtensionOptions
        }
      ]
    };
  }
}
