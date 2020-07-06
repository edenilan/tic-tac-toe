import {Injectable} from '@angular/core';
import {Opponent} from "./opponent";
import {FlatBoard, GameConfig, Player} from "../ttt.types";

@Injectable()
export class DumbOpponentService implements Opponent{

  constructor() {
  }

  public getNextMove(currentPlayer: Player, board: FlatBoard<string>, gameConfig: GameConfig): number {
    return 7;
  }
}
