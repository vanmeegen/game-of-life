// lib imports
import * as React from "react";
import * as ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "es6-shim";
import {Configuration} from "./common/Configuration";
import {GameOfLifeContainer} from "./components/gameoflifecontainer";

// components imports


/*
 * Bootstrap the app
 */
function main(): void {
  console.log("running in mode " + (Configuration.isDevelopment() ? "development" : "production"));
  ReactDOM.render(
      <GameOfLifeContainer/>,
      document.getElementById("app-container")
  );
}
main();

