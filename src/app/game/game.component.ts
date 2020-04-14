import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {filter, map} from "rxjs/operators";

export interface Cell {
  row: number;
  column: number;
}
export interface Move{
  cell: Cell
  value: string;
}
export enum OpponentType {
  HUMAN,
  COMPUTER
}
export interface Player {
  opponentType: OpponentType;
  mark: string;
}
enum PlayerId{
  ONE = 1,
  TWO = 2
}
export interface GameConfig{
  [PlayerId.ONE]: Player;
  [PlayerId.TWO]: Player;
}
const defaultGameConfig: GameConfig = {
  [PlayerId.ONE]: {
    opponentType: OpponentType.HUMAN,
    mark: "O"
  },
  [PlayerId.TWO]: {
    opponentType: OpponentType.HUMAN,
      mark: "X"
  }
};
const EMPTY_BOARD = [
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
];
function updateBoard(currentBoard: string[][],move: Move): string[][]{
  // TODO: refactor to return a fresh Array
  const {cell, value} = move;
  currentBoard[cell.row][cell.column] = value;
  return currentBoard;
}

@Component({
  selector: 'ttt-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input() public gameConfig: GameConfig = defaultGameConfig;
  public boardModel = EMPTY_BOARD;
  private cellClicksSubject = new Subject<Cell>();
  public currentPlayer: Player = this.gameConfig[PlayerId.ONE];
  private moves$: Observable<Move> = this.cellClicksSubject.pipe(
    filter(
      (clickedCell: Cell) => {
        const {row, column} = clickedCell;
        return this.boardModel[row][column] === undefined;
      }
    ),
    filter(() =>
      this.currentPlayer.opponentType !== OpponentType.COMPUTER
    ),
    map(
      (clickedCell: Cell) => ({
        cell: clickedCell,
        value: this.currentPlayer.mark
      })
    )
  );
  constructor() { }

  ngOnInit(): void {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    this.moves$.subscribe(
      (move: Move) => {
        this.boardModel = updateBoard(this.boardModel, move);
        this.toggleCurrentPlayer();
      }
    )
  }
  cellClicked(rowIndex, columnIndex): void {
    console.log(`cell clicked: row ${rowIndex}, column ${columnIndex}`);
    this.cellClicksSubject.next({row: rowIndex, column: columnIndex});
  }
  private toggleCurrentPlayer(): void {
    const player1 = this.gameConfig[PlayerId.ONE];
    const player2 = this.gameConfig[PlayerId.TWO];
    this.currentPlayer = (this.currentPlayer === player1) ? player2 : player1;
  }
}
