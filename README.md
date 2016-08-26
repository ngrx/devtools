# @ngrx/store-devtools

[![Join the chat at https://gitter.im/ngrx/store](https://badges.gitter.im/ngrx/store.svg)](https://gitter.im/ngrx/store?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Devtools for [@ngrx/store](https://github.com/ngrx/store).

## Installation
`npm install @ngrx/store-devtools --save`

### Instrumentation
To instrument @ngrx/store and use the devtools, you will need to setup the instrumentation providers using `instrumentStore()`:

```ts
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    // Note that you must instrument after importing StoreModule
    StoreDevtoolsModule.instrumentStore({
      maxAge: 5,
      monitor: monitorReducer
    })
  ]
})
```

See [@ngrx/store-log-monitor](https://github.com/ngrx/store-log-monitor) for an example monitor built for Angular 2

## Contributing

Please read [contributing guidelines here](https://github.com/ngrx/store-devtools/blob/master/CONTRIBUTING.md).
