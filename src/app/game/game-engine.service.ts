import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {deepCloneBoard, isGameWon, isTie} from "./game.helpers";
import {ComputerOpponentService} from "./computer-opponent.service";
import {Cell, GameConfig, Move, OpponentType, Player, PlayerId, PlayersMap} from "../ttt.types";
import {SettingsService} from "../settings/settings.service";

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
  private gameConfig: GameConfig;
  private players: PlayersMap;
  private currentPlayer: Player;
  constructor(
    private computerOpponentService: ComputerOpponentService,
    private settingsService: SettingsService,
  ) {}

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

  public startNewGame(): void {
    this.gameConfig = this.settingsService.gameConfig;
    this.players = this.gameConfig.players;
    this.currentPlayer = this.players[PlayerId.ONE];
    this.currentPlayer = this.players[PlayerId.ONE];
    this.boardBS.next(EMPTY_BOARD);
    this.winnerBS.next(undefined);
    this.tieGameBS.next(undefined);
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
      const computerCell = this.computerOpponentService.getNextMove(this.currentPlayer, deepCloneBoard(board), this.gameConfig);
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
