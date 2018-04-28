
/* eslint-disable max-len */

// import Playground from "./js/main";
// import { March29 } from "./js/class-work";
// import { April02 } from "./js/home-work/april-02";
// import { April23 } from "./js/class-work/april-23";
import { April28 } from "./js/home-work/april-28";

// import {Test01} from './js/tests/test-01'
// import { Test02 } from "./js/tests/test-02";

/**
 * The linter can be disabled via LINTER=false env var - show a message in console to inform if it's on or off
 * Won't show in production
 */
if (process.env.NODE_ENV !== "production") {
  if (!process.env.LINTER) {
    console.warn(
      "Linter disabled, make sure to run your code against the linter, otherwise, if it fails, your commit will be rejected."
    );
  } else {
    console.info(
      "Linter active, if you meet some problems, you can still run without linter, just set the env var LINTER=false."
    );
  }
} else if (process.env.DEVTOOLS) {
  console.info(
    "Turn on the Sources tab of your devtools to inspect original source code - thanks to sourcemaps!"
  );
}

/**
 * You could setup some mocks for tests
 * Won't show in production
 */
if (process.env.NODE_ENV === "mock") {
  console.info("MOCK mode");
}

if (process.env.DEVTOOLS && process.env.NODE_ENV !== "production") {
  console.info(
    "You're on DEVTOOLS mode, you may have access to tools enhancing developer experience - off to you to choose to disable them in production ..."
  );
}

/** This is where the "real code" start */

// const playground = new Playground();
// playground.init();

const classWork = new April28();
