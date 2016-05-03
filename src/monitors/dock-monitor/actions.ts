import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';


@Injectable()
export class DockActions{
  static TOGGLE_VISIBILITY = '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
  toggleVisibility(): Action {
    return { type: DockActions.TOGGLE_VISIBILITY };
  }

  static CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
  changePosition(): Action {
    return { type: DockActions.CHANGE_POSITION };
  }

  static CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
  changeSize(size: number): Action {
    return { type: DockActions.CHANGE_SIZE, payload: size };
  }

  static CHANGE_MONITOR = '@@redux-devtools-log-monitor/CHANGE_MONITOR';
  changeMonitor(): Action {
    return { type: DockActions.CHANGE_MONITOR };
  }
}
