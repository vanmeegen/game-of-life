import "./Action.ts";
import Dispatcher from "./../Dispatcher";

export function initRandom(): void {
  Dispatcher.dispatch({type: "initRandom"});
}

export function initRegular(): void {
  Dispatcher.dispatch({type: "initRegular"});
}

export function next(): void {
  Dispatcher.dispatch({type: "next"});
}

export function clear(): void {
  Dispatcher.dispatch({type: "clear"});
}

export function set(x: number, y: number, value: boolean): void {
  Dispatcher.dispatch({type: "set", payload: {x, y, value}});
}

export function size(newSize: number): void {
  Dispatcher.dispatch({type: "size", payload: newSize});
}