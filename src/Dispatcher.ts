import Store from "./Store";
import {Action} from "./actions/Action";
import log from "./Logger";

class Dispatcher {
  private _stores: Set<Store> = new Set<Store>();

  dispatch(action: Action): void {
    log.debug("Dispatching action to stores", action);
    this._stores.forEach(store => store.accept(action));
  }

  register(store: Store): void {
    log.debug("Registered store", store);
    this._stores.add(store);
  }
}

export default new Dispatcher();