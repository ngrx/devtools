import { ActionReducer } from '@ngrx/store';
import { OpaqueToken } from '@angular/core';

export interface StoreDevtoolsConfig {
  maxAge?: number;
  monitor?: ActionReducer<any>;
}

export const STORE_DEVTOOLS_CONFIG = new OpaqueToken('@ngrx/devtools Options');
