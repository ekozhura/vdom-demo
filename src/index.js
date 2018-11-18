// @flow
import Snabbdom from 'snabbdom-pragma';
import { sandbox, action, command, httpGet, onResult } from "./runtime";
import { lensProp, set, view } from "ramda";

// const initModel = 0;
// const increment = Symbol("increment");
// const decrement = Symbol("decrement");

// const update = (msg, model) => {
//   switch(msg) {
//     case increment: return ++model;
//     case decrement: return --model;
//     default: return model;
//   }
// };

// const myView = model => {
//   return (
//     <div>
//       <button on-click={ action(increment) }> + </button>
//       <span>{ model }</span>
//       <button on-click={ action(decrement) }> - </button>
//     </div>
//   );
// };

// sandbox({ initModel, update, view: myView });

const runAjax = Symbol("runAjax");
const dataLens = lensProp("data");

sandbox({
  initModel: { data: "~" },
  update: (msg, model) => {
    let { type = Symbol("none") , payload = null} = msg || {};
    switch(type) {
      case runAjax: return [set(dataLens, "...", model), httpGet('https://launchlibrary.net/1.4/launch/2015-08-20')];
      case onResult: {
        return [set(dataLens, payload, model), null];
      }
      default: return [model, null];
    }
  },
  view: ([model, ...cmd]) => {
    return (<div>
      <button on-click={ action({ type: runAjax }) }> get total launches: </button>
      <span> { view(dataLens, model) }</span>
    </div>);
  }
});