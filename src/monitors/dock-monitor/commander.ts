import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Component, Input, Output, Injectable, Renderer} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscriber} from 'rxjs/Subscriber';

import {keycodes} from './keycodes';

export interface ParsedCommand{
  name?: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  sequence?: string;
}

@Component({
  selector: 'ngrx-commander',
  template: '',
  styles: [':host{ display: none }'],
  host: {
    '(document:keydown)': 'keydown$.next($event)'
  }
})
export class Commander{
  private keydown$ = new Subject<KeyboardEvent>();
  private _ignoreTags = ['INPUT', 'SELECT', 'TEXTAREA'];

  constructor(private _renderer: Renderer){ }

  @Input() shortcut: string;
  @Output() command = this.keydown$
    .filter(e => this._ignoreTags.indexOf((e.target as HTMLElement).tagName) < 0)
    .filter(e => !((e.target as HTMLElement).isContentEditable))
    .filter(e => {
      const command = this.parseCommand(this.shortcut);

      if (!command) {
        return false;
      }

      const charCode = e.keyCode || e.which;
      const char = String.fromCharCode(charCode);
      return command.name.toUpperCase() === char.toUpperCase() &&
        command.alt === e.altKey &&
        command.ctrl === e.ctrlKey &&
        command.meta === e.metaKey &&
        command.shift === e.shiftKey;
    })
    .map(e => {
      e.preventDefault();

      return { command: this.shortcut };
    });

  parseCommand(s: string): ParsedCommand {
    var keyString = s.trim().toLowerCase();

    if ( !/^(ctrl-|shift-|alt-|meta-){0,4}\w+$/.test(keyString) ){
      throw new Error('The string to parse needs to be of the format "c", "ctrl-c", "shift-ctrl-c".');
    }

    const parts = keyString.split('-');
    const key: ParsedCommand = {
      ctrl: false,
      meta: false,
      shift: false,
      alt: false
    };

    let c;

    key.name = parts.pop();

    while((c = parts.pop())) {
      key[c] = true;
    }

    if(key.ctrl) {
      key.sequence = keycodes.ctrl[key.name] || key.name;
    }
    else {
      key.sequence = keycodes.nomod[key.name] || key.name;
    }

    if (key.shift && key.sequence && key.sequence.length === 1) {
      key.sequence = key.sequence.toUpperCase();
    }

    return key;
  }
}
