import { request } from "@most/xhr";
import { runEffects, tap } from "@most/core";
import { newDefaultScheduler } from "@most/scheduler";
import { action } from "./main";

export const httpGet = url => request(() => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open('GET', url, true);
  return xhr;
});
