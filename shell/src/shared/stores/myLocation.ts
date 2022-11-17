import {readable} from "svelte/store";
import {Subscriber} from "svelte/types/runtime/store";

export const myLocation = {
  subscribe: (subscriber: Subscriber<GeolocationPosition|GeolocationPositionError|Error|null>) => _myLocation.subscribe(subscriber),
  reload: () => {
    // TODO: This doesn't open another access-prompt for the user (at least in FF)?!
    _myLocationState = null;
    _reload();
  },
  state: () => _myLocationState
};

let _myLocationState:GeolocationPosition|GeolocationPositionError|Error|null = null;
let _reload: () => void;

const _myLocation = readable<GeolocationPosition|GeolocationPositionError|Error>(null, function start(set) {

  function onGetLocationError(error:Error|GeolocationPositionError) {
    console.log("Couldn't get your position: ", error);
    _myLocationState = error;
    set(error);
  }

  function onConfigureMap(position: GeolocationPosition) {
    console.log("Your position: ", position);
    _myLocationState = position;
    set(position);
  }

  _reload = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onConfigureMap, onGetLocationError);
    } else {
      onGetLocationError(new Error(`navigator.geolocation is not available`));
    }
  }

  return function stop() {
    console.log("myLocation store stopped.");
  };
});
