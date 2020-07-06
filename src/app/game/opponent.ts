import {FlatBoard, GameConfig, Player} from "../ttt.types";
import {InjectionToken} from "@angular/core";
import {Observable} from "rxjs";

export interface Opponent {
  getNextMove: (currentPlayer: Player, board: FlatBoard<string>, gameConfig: GameConfig) => Observable<number>
}

export const OPPONENT_DI_TOKEN = new InjectionToken<Opponent>("ttt.opponent");
