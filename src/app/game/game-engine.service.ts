import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

export interface Cell {
  row: number;
  column: number;
}
export interface Move{
  cell: Cell
  player: Player;
}
export enum OpponentType {
  HUMAN,
  COMPUTER
}
export interface Player {
  opponentType: OpponentType;
  mark: string;
  name: string;
}
enum PlayerId{
  ONE = 1,
  TWO = 2
}
export interface GameConfig{
  [PlayerId.ONE]: Player;
  [PlayerId.TWO]: Player;
}
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];
const defaultGameConfig: GameConfig = {
  [PlayerId.ONE]: {
    opponentType: OpponentType.HUMAN,
    mark: "O",
    name: "Player 1",
  },
  [PlayerId.TWO]: {
    opponentType: OpponentType.HUMAN,
    mark: "X",
    name: "Player 2",
  }
};
const EMPTY_BOARD = [
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
];

function flattenBoard(board: string[][]): string[] {
  return board.reduce((acc, currentRow) => [...acc, ...currentRow], []);
}

function isGameWon(board: string[][], player: Player): boolean {
  const flattenedBoard = flattenBoard(board);
  const playerCellIndices = flattenedBoard.reduce(
    (acc, currCellValue, index) => (currCellValue === player.mark) ? [...acc, index] : acc
    ,[]
  );
  return winCombos.some(combo =>
    combo.every(index =>
      playerCellIndices.includes(index)
    )
  );
}

function isTie(board: string[][], player: Player): boolean {
  const flattenedBoard = flattenBoard(board);
  return !isGameWon(board, player) && flattenedBoard.every((cellValue: string) => cellValue !== undefined);
}

@Injectable()
export class GameEngineService {
  public boardBS = new BehaviorSubject<string[][]>(EMPTY_BOARD);
  public board$: Observable<string[][]> = this.boardBS.asObservable();
  private winnerBS = new BehaviorSubject<Player>(undefined);
  public winner$: Observable<Player> = this.winnerBS.asObservable();
  private tieGameBS = new BehaviorSubject<true>(undefined);
  public tieGame$: Observable<true> = this.tieGameBS.asObservable();
  private gameConfig: GameConfig = defaultGameConfig;
  private currentPlayer: Player = this.gameConfig[PlayerId.ONE];
  constructor() {
  }

  public cellClicked(cell: Cell): void {
    if (this.isGameOver()){
      return;
    }
    const currentBoard = this.boardBS.getValue();
    if (currentBoard[cell.row][cell.column] !== undefined){
      return;
    }
    const move: Move = {
      cell: cell,
      player: this.currentPlayer
    };
    this.executeMove(currentBoard, move);
  }

  private executeMove(board: string[][], move: Move): void {
    this.updateBoard(board, move);
    if (isGameWon(board, move.player)){
      this.winnerBS.next(move.player);
    }
    else if (isTie(board, move.player)){
      this.tieGameBS.next(true);
    }
    else {
      this.toggleCurrentPlayer();
    }
  }

  private updateBoard(board: string[][], move: Move){
    const {cell, player} = move;
    let freshBoard = [...board];
    freshBoard[cell.row][cell.column] = player.mark;
    this.boardBS.next(freshBoard);
  }
  private toggleCurrentPlayer(): void {
    const player1 = this.gameConfig[PlayerId.ONE];
    const player2 = this.gameConfig[PlayerId.TWO];
    this.currentPlayer = (this.currentPlayer === player1) ? player2 : player1;
  }
  private isGameOver(): boolean {
    return (this.winnerBS.getValue() !== undefined) || this.tieGameBS.getValue();
  }
}
