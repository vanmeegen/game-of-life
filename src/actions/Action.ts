export interface Action {
  type: ActionType;
  payload: any;
}
export type ActionType =
    "reinit" /* reinit game of life board*/
        | "next" /* calculate and render next generation*/;