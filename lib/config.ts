import { ActionReducer } from '@ngrx/store';

export interface Options {
  maxAge?: number;
  monitor?: ActionReducer<any>;
}

export const OPTIONS = new String('@ngrx/devtools Options');
