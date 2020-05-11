import { AlertsQueue, Alert, INITIAL_ALERTS_QUEUE } from "../types/datatypes";
import { AnyAction } from "redux";
import { ALERTS_SHOW, ALERTS_HIDE, AlertsAction } from "../actions/alerts.actions";
import { ReducerTransformerFn } from "./reducers";

const alertsQueueTransformers: Map<any, ReducerTransformerFn<AlertsQueue>> = new Map<
  any,
  ReducerTransformerFn<AlertsQueue>
>()
  .set(ALERTS_SHOW, transformAlertShow)
  .set(ALERTS_HIDE, transformAlertHide);

function transformAlertShow(state: AlertsQueue, action: AnyAction) {
  return {
    alerts: changeAlertsQueue(state.alerts, (action as AlertsAction).alert, true),
  };
}

function transformAlertHide(state: AlertsQueue, action: AnyAction) {
  return {
    alerts: changeAlertsQueue(state.alerts, (action as AlertsAction).alert, false),
  };
}

function changeAlertsQueue(queue: Alert[], alert: Alert, add: boolean): Alert[] {
  if (!queue) {
    queue = [];
  }
  const ind = queue.findIndex((value: Alert, index: number, obj: Alert[]) => alert.id === value.id);
  if (add) {
    if (ind === -1) {
      queue.push(alert);
    }
  } else {
    if (ind > -1) {
      queue.splice(ind, 1);
    }
  }
  return queue;
}

export function alertsQueueReducer(state: AlertsQueue = INITIAL_ALERTS_QUEUE, action: AnyAction) {
  const transformer = alertsQueueTransformers.get(action.type);
  return !!transformer ? transformer(state, action) : state;
}
