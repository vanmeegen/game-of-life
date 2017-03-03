interface GeneralActionType {
  type: ActionType;
  payload?: any;
}

type SetAction = {type: "set", payload: {x: number, y: number, value: boolean}};
type SizeAction = {type: "size", payload: number};
export type ActionType =
    "clear" /* reinit game of life cell*/
        | "next" /* calculate and render next generation*/
        | "initRandom" /* init cell with random life */
        | "initRegular" /* init cell with regular pattern */
        | "set"
        | "size";
/* set life on position x,y to value (true or false) */


export type Action = GeneralActionType | SetAction | SizeAction;