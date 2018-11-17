// @flow
import Snabbdom from 'snabbdom-pragma';
import { sandbox, action } from "./elmlike";

const initModel = 0;
const increment = Symbol("increment");
const decrement = Symbol("decrement");

const update = (msg, model) => {
  switch(msg) {
    case increment: return ++model;
    case decrement: return --model;
    default: return model;
  }
};

const view = model => {
  return (
    <div>
      <button on-click={ action(increment) }> + </button>
      <span>{ model }</span>
      <button on-click={ action(decrement) }> - </button>
    </div>
  );
};

sandbox({ initModel, update, view });
