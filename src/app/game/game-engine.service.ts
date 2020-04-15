import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {deepCloneBoard, isGameWon, isTie} from "./game.helpers";
import {ComputerOpponentService} from "./computer-opponent.service";
import {Cell, GameConfig, Move, OpponentType, Player, PlayerId, PlayersMap} from "./game.types";

// TODO: this should be in a dedicated configService
const defaultGameConfig: GameConfig = {
  players: {
    [PlayerId.ONE]: {
      opponentType: OpponentType.HUMAN,
      mark: "O",
      name: "Player 1",
    },
    [PlayerId.TWO]: {
      opponentType: OpponentType.COMPUTER,
      mark: "X",
      name: "Computer",
    }

  }
};
const EMPTY_BOARD = [
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
];

@Injectable()
export class GameEngineService {
  public boardBS = new BehaviorSubject<string[][]>(EMPTY_BOARD);
  public board$: Observable<string[][]> = this.boardBS.asObservable();
  private winnerBS = new BehaviorSubject<Player>(undefined);
  public winner$: Observable<Player> = this.winnerBS.asObservable();
  private tieGameBS = new BehaviorSubject<true>(undefined);
  public tieGame$: Observable<true> = this.tieGameBS.asObservable();
  private players: PlayersMap = defaultGameConfig.players;
  private currentPlayer: Player = this.players[PlayerId.ONE];
  constructor(private computerOpponentService: ComputerOpponentService) {
    this.computerOpponentService.setConfig(this.players);
    this.startGame();
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

  public replayGame(): void {
    this.boardBS.next(EMPTY_BOARD);
    this.winnerBS.next(undefined);
    this.tieGameBS.next(undefined);
    this.currentPlayer = this.players[PlayerId.ONE];
    this.startGame();
  }

  private startGame(): void {
    this.playComputerIfNeeded(EMPTY_BOARD);
  }

  private executeMove(board: string[][], move: Move): void {
    board = this.updateBoard(board, move);
    if (isGameWon(board, move.player)){
      this.winnerBS.next(move.player);
      return;
    }
    if (isTie(board, move.player)){
      this.tieGameBS.next(true);
      return;
    }
    this.toggleCurrentPlayer();
    this.playComputerIfNeeded(board);
  }

  private playComputerIfNeeded(board: string[][]): void {
    if (this.currentPlayer.opponentType === OpponentType.COMPUTER){
      const computerCell = this.computerOpponentService.getNextMove(deepCloneBoard(board));
      const computerMove: Move = {
        cell: computerCell,
        player: this.currentPlayer
      };
      this.executeMove(board, computerMove);
    }
  }

  private updateBoard(board: string[][], move: Move): string[][]{
    const {cell, player} = move;
    const freshBoard = deepCloneBoard(board);
    freshBoard[cell.row][cell.column] = player.mark;
    this.boardBS.next(freshBoard);
    return freshBoard;
  }
  private toggleCurrentPlayer(): void {
    const player1 = this.players[PlayerId.ONE];
    const player2 = this.players[PlayerId.TWO];
    this.currentPlayer = (this.currentPlayer === player1) ? player2 : player1;
  }
  private isGameOver(): boolean {
    return (this.winnerBS.getValue() !== undefined) || this.tieGameBS.getValue();
  }
}
