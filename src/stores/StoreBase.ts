import {Action} from "../actions/Action";
import Dispatcher from "../Dispatcher";

type StoreListener = (reason: any) => void;

abstract class StoreBase {

  private _listeners: Set<StoreListener> = new Set<StoreListener>();

  constructor() {
    Dispatcher.register(this);
  }

  close(): void {
    Dispatcher.deregister(this);
  }

  abstract accept(action: Action): void;

  register(listener: StoreListener): void {
    this._listeners.add(listener);
  }

  deregister(listener: StoreListener): void {
    this._listeners.delete(listener);
  }

  // reason: any debugging help to get an idea what was the change reason
  // der eine Aussage über die Art der Änderung macht
  protected notify(reason: any): void {
    this._listeners.forEach(listener => listener(reason));
  }

}

export default StoreBase;