# @ngrx/store-devtools

[![Join the chat at https://gitter.im/ngrx/store](https://badges.gitter.im/ngrx/store.svg)](https://gitter.im/ngrx/store?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/%40ngrx%2Fdevtools.svg)](https://badge.fury.io/js/%40ngrx%2Fdevtools)

Devtools for [@ngrx/store](https://github.com/ngrx/store).

## Installation
`npm install @ngrx/store-devtools --save-dev`

### Instrumentation
To instrument @ngrx/store and use the devtools, you will need to setup the instrumentation providers using the `instrumentStore` helper function.

Here is an example configuration that uses  [@ngrx/store-log-monitor](https://github.com/ngrx/store-log-monitor)

```ts
import {instrumentStore} from '@ngrx/store-devtools';
import {LogMonitor, useLogMonitor} from '@ngrx/store-log-monitor';

@Component({
  selector: 'app',
  providers: [
    provideStore(reducer),
    instrumentStore({
      monitor: useLogMonitor({
        // Default log monitor options
        position: 'right',
        visible: true,
        size: 0.3
      })
    })
  ],
  directives: [ LogMonitor ],
  template: `
    <ngrx-store-log-monitor></ngrx-store-log-monitor>
  `
})
export class App { ... }
```

## Contributing

Please read [contributing guidelines here](https://github.com/ngrx/store-devtools/blob/master/CONTRIBUTING.md).
