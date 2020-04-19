import {Injectable} from '@angular/core';
import {GameConfig, OpponentType, PlayerId} from "../ttt.types";

export const MARKS: string[] = ["❌","⭕","🐔","🐷","🐻","🐺","🐵","🦊","🦄","🦔","🦜","🦋","🌼","🍄", "👽", "🍓", "🥑", "🍗", "🍔", "💩", "🤖", "👻", "⛄","💥"];
const defaultGameConfig: GameConfig = {
  players: {
    [PlayerId.ONE]: {
      opponentType: OpponentType.HUMAN,
      mark: MARKS[0],
      name: "Player 1",
    },
    [PlayerId.TWO]: {
      opponentType: OpponentType.COMPUTER,
      mark: MARKS[1],
      name: "Player 2",
    }
  }
};
@Injectable()
export class SettingsService {
  public gameConfig: GameConfig = defaultGameConfig;
  constructor() {
  }
}
