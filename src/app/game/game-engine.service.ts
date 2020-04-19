import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {deepCloneBoard, generateEmptyBoard, getFlatIndex, isGameWon, isTie} from "./game.helpers";
import {ComputerOpponentService} from "./computer-opponent.service";
import {
  BoardCell,
  BoardCoordinates,
  FlatBoard,
  GameConfig,
  Move,
  OpponentType,
  Player,
  PlayerId,
  PlayersMap
} from "../ttt.types";
import {SettingsService} from "../settings/settings.service";

@Injectable()
export class GameEngineService {
  public boardBS = new BehaviorSubject<FlatBoard>(generateEmptyBoard(3, 3));
  public board$: Observable<FlatBoard> = this.boardBS.asObservable();
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

  public cellClicked(boardCoordinates: BoardCoordinates): void {
    if (this.isGameOver()){
      return;
    }
    const currentBoard = this.boardBS.getValue();
    const flatIndex = getFlatIndex(boardCoordinates, currentBoard.numColumns);
    if (currentBoard[flatIndex] !== undefined){
      return;
    }
    const move: Move = {
      flatIndex: flatIndex,
      player: this.currentPlayer
    };
    this.executeMove(currentBoard, move);
  }

  public startNewGame(): void {
    this.gameConfig = this.settingsService.gameConfig;
    this.players = this.gameConfig.players;
    this.currentPlayer = this.players[PlayerId.ONE];
    this.currentPlayer = this.players[PlayerId.ONE];
    const emptyBoard: FlatBoard = generateEmptyBoard(3, 3);
    this.boardBS.next(emptyBoard);
    this.winnerBS.next(undefined);
    this.tieGameBS.next(undefined);
    this.playComputerIfNeeded(emptyBoard);
  }

  private executeMove(board: FlatBoard, move: Move): void {
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

  private playComputerIfNeeded(board: FlatBoard): void {
    if (this.currentPlayer.opponentType === OpponentType.COMPUTER){
      const flatIndex = this.computerOpponentService.getNextMove(this.currentPlayer, deepCloneBoard(board), this.gameConfig);
      const computerMove: Move = {
        flatIndex: flatIndex,
        player: this.currentPlayer
      };
      this.executeMove(board, computerMove);
    }
  }
  private updateBoard(currentBoard: FlatBoard, move: Move): FlatBoard{
    const {flatIndex, player} = move;
    const updatedCells = currentBoard.cells.map((cell: BoardCell, index: number) => {
      const cellValue = (index === flatIndex) ? player.mark : cell.value;
      return {...cell, value: cellValue};
    });
    const updatedBoard: FlatBoard = {...currentBoard, cells: updatedCells};
    this.boardBS.next(updatedBoard);
    return updatedBoard;
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
