---
# This repository is for version 3.x of of @ngrx/store-devtools.
# [Click here for the latest version (4.x)](https://github.com/ngrx/platform)
---

# @ngrx/store-devtools
Devtools for [@ngrx/store](https://github.com/ngrx/store).

[![Join the chat at https://gitter.im/ngrx/store](https://badges.gitter.im/ngrx/store.svg)](https://gitter.im/ngrx/store?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation
`npm install @ngrx/store-devtools@3.2.4 --save`


## Instrumentation
### Instrumentation with the Chrome / Firefox Extension (Preferred)

1. Download the [Redux Devtools Extension](http://zalmoxisus.github.io/redux-devtools-extension/)

2. In your root Angular module import `StoreDevtoolsModule.instrumentOnlyWithExtension()`:

  ```ts
  import { StoreDevtoolsModule } from '@ngrx/store-devtools';

  @NgModule({
    imports: [
      StoreModule.provideStore(rootReducer),
      // Note that you must instrument after importing StoreModule
      StoreDevtoolsModule.instrumentOnlyWithExtension({
        maxAge: 5
      })
    ]
  })
  export class AppModule { }
  ```

### Instrumentation with a Custom Monitor
To instrument @ngrx/store and use the devtools with a custom monitor you will need to setup the
instrumentation providers using `instrumentStore()`:

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
export class AppModule { }
```

See [@ngrx/store-log-monitor](https://github.com/ngrx/store-log-monitor) for an example monitor built for Angular 2

## Contributing

Please read [contributing guidelines here](https://github.com/ngrx/store-devtools/blob/master/CONTRIBUTING.md).
