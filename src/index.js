// @flow
import Snabbdom from 'snabbdom-pragma';
import { application, action, onResult } from "./runtime/main";
import { lensProp, set, view, over } from "ramda";
import { httpGet } from './runtime/request';

const increment = Symbol("increment");
const decrement = Symbol("decrement");
const runAjax = Symbol("runAjax");
const dataLens = lensProp("data");
const counterLens = lensProp("counter");

const counterView = model => {
  return (
    <div>
      <button on-click={ action({ type: increment }) }> + </button>
      <span>{ model }</span>
      <button on-click={ action({ type: decrement }) }> - </button>
    </div>
  );
};

application({
  initModel: { data: "~", counter: 0 },
  update: (msg, [model, cmd]) => {
    let { type = Symbol("none"), payload = null} = msg || {};
    switch(type) {
      case runAjax: return [set(dataLens, "loading...", model), httpGet('https://launchlibrary.net/1.4/launch/2015-08-20')];
      case onResult: return [set(dataLens, payload, model), null];
      case increment: return [over(counterLens, x => x + 1, model), null];
      case decrement: return [over(counterLens, x => x - 1, model), null];
      default: return [model, null];
    }
  },
  view: ([model, _]) => {
    return (<div>
      <button on-click={ action({ type: runAjax }) }> get total launches: </button>
      <span> { view(dataLens, model) }</span>
      <hr/>
      { counterView(view(counterLens, model)) }
    </div>);
  }
});