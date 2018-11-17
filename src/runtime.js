// @flow
import {init} from "snabbdom";
import h from "snabbdom/h";
import eventListenersModule from "snabbdom/modules/eventlisteners";
import { runEffects, tap } from "@most/core";
import { newDefaultScheduler } from "@most/scheduler";

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

export const sandbox = function({ initModel, update, view }) {
  let node = document.body, model = initModel;
  onUpdate(msg => {
    model = update(msg, model);
    node = patch(node, view(model));
  });
  runUpdate();
};

class CommandStream {
  constructor(msg) {
    this.msg = msg;
  }

  run(sink, scheduler) {
    sink.event(scheduler, this.msg);
    return { 
      dispose() {}
    }
  }
}

export const action = msg => {
  const action$ = new CommandStream(msg);
  return function() { 
    runEffects(tap(runUpdate, action$), newDefaultScheduler()); 
  };
}

export default {
  action,
  sandbox
};
