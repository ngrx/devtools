import { NgModule, OpaqueToken, Injector, ModuleWithProviders } from '@angular/core';
import { StoreModule, State, INITIAL_STATE, INITIAL_REDUCER, Dispatcher, Reducer } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { StoreDevtools, DevtoolsDispatcher } from './devtools';
import { StoreDevtoolsConfig, STORE_DEVTOOLS_CONFIG, INITIAL_OPTIONS } from './config';
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

export function noMonitor() {
  return null;
}

export function _createOptions(_options): StoreDevtoolsConfig {
  const DEFAULT_OPTIONS: StoreDevtoolsConfig = { monitor: noMonitor };

  let options = typeof _options === 'function' ? _options() : _options;

  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (options.maxAge && options.maxAge < 2) {
    throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${options.maxAge}`);
  }

  return options;
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
  static instrumentStore(_options: StoreDevtoolsConfig | (() => StoreDevtoolsConfig) = {}): ModuleWithProviders {

    return {
      ngModule: StoreDevtoolsModule,
      providers: [
        {
          provide: State,
          deps: [ StoreDevtools ],
          useFactory: _createState
        },
        {
          provide: INITIAL_OPTIONS,
          useValue: _options
        },
        {
          provide: Reducer,
          deps: [ DevtoolsDispatcher, INITIAL_REDUCER ],
          useFactory: _createReducer
        },
        {
          provide: STORE_DEVTOOLS_CONFIG,
          deps: [INITIAL_OPTIONS],
          useFactory: _createOptions
        }
      ]
    };
  }

  static instrumentOnlyWithExtension(_options: StoreDevtoolsConfig | (() => StoreDevtoolsConfig) = {}): ModuleWithProviders {
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
          provide: INITIAL_OPTIONS,
          useValue: _options
        },
        {
          provide: STORE_DEVTOOLS_CONFIG,
          deps: [INITIAL_OPTIONS],
          useFactory: _createOptions
        }
      ]
    };
  }
}
