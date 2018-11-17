// @flow
import {init} from "snabbdom";
import h from "snabbdom/h";
import eventListenersModule from "snabbdom/modules/eventlisteners";

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

export const action = msg => () => runUpdate(msg);

export default {
  action,
  sandbox
};
