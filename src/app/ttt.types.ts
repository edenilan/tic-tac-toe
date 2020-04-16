export interface Cell {
  row: number;
  column: number;
}
export interface Move{
  cell: Cell
  player: Player;
}
export enum OpponentType {
  HUMAN = "Human",
  COMPUTER = "Computer"
}
export interface Player {
  opponentType: OpponentType;
  mark: string;
  name: string;
}
export enum PlayerId{
  ONE = 1,
  TWO = 2
}

export interface PlayersMap {
  [PlayerId.ONE]: Player;
  [PlayerId.TWO]: Player;
}

export interface GameConfig{
  players: PlayersMap
}
