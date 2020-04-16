import {Injectable} from '@angular/core';
import {GameConfig, OpponentType, PlayerId} from "../ttt.types";

const defaultPlayer1Mark = "O";
const defaultPlayer2Mark = "X";
const defaultGameConfig: GameConfig = {
  players: {
    [PlayerId.ONE]: {
      opponentType: OpponentType.HUMAN,
      mark: defaultPlayer1Mark,
      name: "Player 1",
    },
    [PlayerId.TWO]: {
      opponentType: OpponentType.COMPUTER,
      mark: defaultPlayer2Mark,
      name: "Player 2",
    }
  }
};
@Injectable()
export class SettingsService {
  public gameConfig: GameConfig = defaultGameConfig;
  constructor() {
  }
  public set2PlayerMode(): void {
    this.gameConfig.players = {
      [PlayerId.ONE]: {
        opponentType: OpponentType.HUMAN,
        mark: defaultPlayer1Mark,
        name: "Player 1",
      },
      [PlayerId.TWO]: {
        opponentType: OpponentType.HUMAN,
        mark: defaultPlayer2Mark,
        name: "Player 2",
      }
    };
  }
  public setPlayerVsComputerMode(): void {
    this.gameConfig.players = {
      [PlayerId.ONE]: {
        opponentType: OpponentType.HUMAN,
        mark: defaultPlayer1Mark,
        name: "Player 1",
      },
      [PlayerId.TWO]: {
        opponentType: OpponentType.COMPUTER,
        mark: defaultPlayer2Mark,
        name: "Computer",
      }
    };
  }
}
