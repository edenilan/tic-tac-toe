import {Injectable} from '@angular/core';
import {Opponent} from "./opponent";
import {FlatBoard, GameConfig, Player} from "../ttt.types";
import {Observable, of} from "rxjs";

@Injectable()
export class DumbOpponentService implements Opponent{

  constructor() {
  }

  public getNextMove(currentPlayer: Player, board: FlatBoard<string>, gameConfig: GameConfig): Observable<number> {
    return of(7);
  }
}
