export interface BoardCoordinates {
  row: number;
  column: number;
}
export interface BoardCell {
  value: string;
  isInWinningCombo: boolean;
}
export const emptyBoardCell: BoardCell = {
  value: undefined,
  isInWinningCombo: false
};
export interface FlatBoard {  //1-dimensional board
  cells: BoardCell[];
  numRows: number;
  numColumns: number;
}
export type TwoDimensionalBoard = BoardCell[][];

export interface Move{
  flatIndex: number;
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
  players: PlayersMap;
}
