import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {deepCloneBoard, generateEmptyBoard, getFlatIndex, getWinningIndices, isGameWon, isTie} from "./game.helpers";
import {
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
import {filter, map} from "rxjs/operators";
import {Opponent, OPPONENT_DI_TOKEN} from "./opponent";

@Injectable()
export class GameEngineService {
  public boardBS = new BehaviorSubject<FlatBoard<string>>(generateEmptyBoard(3, 3));
  public board$: Observable<FlatBoard<string>> = this.boardBS.asObservable();
  private winnerBS = new BehaviorSubject<Player>(undefined);
  public winner$: Observable<Player> = this.winnerBS.asObservable();
  private tieGameBS = new BehaviorSubject<true>(undefined);
  public tieGame$: Observable<true> = this.tieGameBS.asObservable();
  private gameConfig: GameConfig;
  private players: PlayersMap;
  private currentPlayer: Player;
  public winningIndices$: Observable<number[]> = combineLatest([this.winner$, this.board$]).pipe(
    filter(([winner, board]) => winner !== undefined),
    map(([winner, board]) => getWinningIndices(board, winner))
);
  constructor(
    @Inject(OPPONENT_DI_TOKEN) private opponentService: Opponent,
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
    const emptyBoard: FlatBoard<string> = generateEmptyBoard(3, 3);
    this.boardBS.next(emptyBoard);
    this.winnerBS.next(undefined);
    this.tieGameBS.next(undefined);
    this.playComputerIfNeeded(emptyBoard);
  }

  private executeMove(board: FlatBoard<string>, move: Move): void {
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

  private playComputerIfNeeded(board: FlatBoard<string>): void {
    if (this.currentPlayer.opponentType === OpponentType.COMPUTER){
      const flatIndex = this.opponentService.getNextMove(this.currentPlayer, deepCloneBoard(board), this.gameConfig);
      const computerMove: Move = {
        flatIndex: flatIndex,
        player: this.currentPlayer
      };
      this.executeMove(board, computerMove);
    }
  }
  private updateBoard(currentBoard: FlatBoard<string>, move: Move): FlatBoard<string>{
    const {flatIndex, player} = move;
    const updatedCells = currentBoard.cells.map(
      (cell: string, index: number) => (index === flatIndex) ? player.mark : cell
    );
    const updatedBoard: FlatBoard<string> = {...currentBoard, cells: updatedCells};
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
