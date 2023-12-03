import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

var __awaiter =
  (undefined && undefined.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
function replaceImg(img) {
  img.onerror = null;
  img.src = "/dist/icons/account.svg";
}
const registerServiceWorker = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    if ("serviceWorker" in navigator) {
      try {
        const registration = yield navigator.serviceWorker.register(
          "/dist/sw.js",
          {
            scope: "/",
          }
        );
        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  });
function showMap2() {
  console.log("ma2p");
  new Map({
    layers: [new TileLayer({ source: new OSM() })],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
    target: "map",
  });
}
showMap2();
function sayHello() {
  return "Hi ya all!";
}

export { registerServiceWorker, replaceImg, sayHello, showMap2 };
