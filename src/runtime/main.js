// @flow
import {init} from "snabbdom";
import h from "snabbdom/h";
import eventListenersModule from "snabbdom/modules/eventlisteners";
import { runEffects, tap, now } from "@most/core";
import { newDefaultScheduler } from '@most/scheduler';

let patch = init([
  eventListenersModule
]);

const { runUpdate, onUpdate } = (function() {
  let handler = _ => {};

  const onUpdate = fn => handler = fn;

  const runUpdate = msg => handler(msg);

  return {
    onUpdate,
    runUpdate
  };
})();

export const application = function({ initModel, update, view }) {
  let node = document.body, model = [initModel, null];
  onUpdate(msg => {
    model = update(msg, model);
    const [ data, cmd ] = model;
    if (cmd) {
      command(cmd);
    }
    node = patch(node, view(model));
  });
  runUpdate();
};

export const action = msg => () => {
  runEffects(tap(runUpdate, now(msg)), newDefaultScheduler());
}

export const onResult = Symbol("onResult");
export const command = cmd => {
  runEffects(tap((e) => {
    action({ type: onResult, payload: e.target.response.total })();
  }, cmd), newDefaultScheduler());
}

export default { action, application };
