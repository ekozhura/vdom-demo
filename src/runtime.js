// @flow
import {init} from "snabbdom";
import h from "snabbdom/h";
import eventListenersModule from "snabbdom/modules/eventlisteners";
import { runEffects, tap, now } from "@most/core";
import { request } from "@most/xhr";
import { newDefaultScheduler } from '@most/scheduler';

let patch = init([
  eventListenersModule
]);

export const onResult = Symbol("onResult");

const { runUpdate, onUpdate } = (function() {
  let handler = _ => {};

  const onUpdate = fn => handler = fn;

  const runUpdate = msg => handler(msg);

  return {
    onUpdate,
    runUpdate
  };
})();

export const sandbox = function({ initModel, update, view }) {
  let node = document.body, model = initModel;
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

export const httpGet = url => request(() => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open('GET', url, true);
  return xhr;
});

export const command = cmd => {
  runEffects(tap((e) => {
    action({ type: onResult, payload: e.target.response.total })();
  }, cmd), newDefaultScheduler());
}

export default { action, sandbox };
