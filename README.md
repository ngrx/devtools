# @ngrx/devtools

[![Join the chat at https://gitter.im/ngrx/store](https://badges.gitter.im/ngrx/store.svg)](https://gitter.im/ngrx/store?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[ ![Codeship Status for ngrx/devtools](https://img.shields.io/codeship/888d1230-c7dd-0133-9ded-4eb1cc5240c5/master.svg)](https://codeship.com/projects/121789)
[![npm version](https://badge.fury.io/js/%40ngrx%2Fdevtools.svg)](https://badge.fury.io/js/%40ngrx%2Fdevtools)

Devtools for @ngrx projects.

## Installation
`npm install @ngrx/devtools --save-dev`

## Available Devtools
### @ngrx/store Instrumentation
To instrument your @ngrx/store and use the devtools, simply call `instrumentStore()` after you call `provideStore()` then use the `Devtools` component:

```ts
import {Devtools, instrumentStore} from '@ngrx/devtools';

@Component({
	selector: 'app',
	providers: [
		provideStore(reducer),
		instrumentStore()
	],
	directives: [ Devtools ],
	template: `
		<ngrx-devtools></ngrx-devtools>
	`
})
export class App{ ... }
```

### Customization
To customize the default layout for the devtools, import the `devtoolsConfig` function, add it to providers with an object with  `position` (top, bottom, left, right), `size` (0.3) and `visible` (true).
To set different commands for toggling dock visibility and position, use the `toggle-command` (ctrl-h) and `position-command` (ctrl-m) inputs on the `ngrx-devtools` component:

```ts
import {Devtools, instrumentStore, devtoolsConfig} from '@ngrx/devtools';

@Component({
	providers: [
		instrumentStore(),
		devtoolsConfig({
			position: 'bottom',
			visible: false,
			size: 0.3
		})
	],
	directives: [ Devtools ],
	template: `
		<ngrx-devtools toggle-command="ctrl-k" position-command="ctrl-e"></ngrx-devtools>
	`
})
export class App{ ... }
```

## Contributing

Please read [contributing guidelines here](https://github.com/ngrx/devtools/blob/master/CONTRIBUTING.md).
