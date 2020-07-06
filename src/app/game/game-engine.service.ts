import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, merge, Observable, Subject} from "rxjs";
import {
  deepCloneBoard,
  findWinner,
  generateEmptyBoard,
  getFlatIndex,
  getWinningIndices,
  isTie
} from "./game.helpers";
import {BoardCoordinates, FlatBoard, GameConfig, Move, OpponentType, Player, PlayerId, PlayersMap} from "../ttt.types";
import {SettingsService} from "../settings/settings.service";
import {delay, filter, map, retry, switchMap, take, withLatestFrom} from "rxjs/operators";
import {Opponent, OPPONENT_DI_TOKEN} from "./opponent";

@Injectable()
export class GameEngineService {
  private cellClicksSubject = new Subject<BoardCoordinates>();
  public cellClicks$: Observable<BoardCoordinates> = this.cellClicksSubject.asObservable();
  private currentPlayerBS = new BehaviorSubject<Player>(this.settingsService.gameConfig.players[PlayerId.ONE]);
  public currentPlayer$: Observable<Player> = this.currentPlayerBS.asObservable();
  public boardBS = new BehaviorSubject<FlatBoard<string>>(generateEmptyBoard(3, 3));
  public board$: Observable<FlatBoard<string>> = this.boardBS.asObservable();
  public winner$: Observable<Player | undefined> = this.board$.pipe(
    map(board => {
      const player1 = this.settingsService.gameConfig.players[PlayerId.ONE];
      const player2 = this.settingsService.gameConfig.players[PlayerId.TWO];
      return findWinner(board, [player1, player2])
    }),
  );
  public isGameWon$: Observable<boolean> = this.winner$.pipe(
    map(winner => winner !== undefined)
  );
  public tieGame$: Observable<boolean> = this.board$.pipe(
    map(board => isTie(board, Object.values(this.settingsService.gameConfig.players))),
  );
  public gameOver$: Observable<boolean> = combineLatest([this.isGameWon$, this.tieGame$]).pipe(
    map(([gameWon, tieGame]) => gameWon || tieGame)
  );
  private gameConfig: GameConfig;
  private players: PlayersMap;
  public winningIndices$: Observable<number[]> = combineLatest([this.winner$, this.board$]).pipe(
    map(([winner, board]) =>
      (winner !== undefined) ? getWinningIndices(board, winner) : []
    )
);
  private humanMove$: Observable<Move> = this.currentPlayer$.pipe(
    filter(currentPlayer => currentPlayer.opponentType === OpponentType.HUMAN),
    switchMap(currentPlayer =>
      this.cellClicks$.pipe(
        withLatestFrom(this.board$),
        map(([coordinates, board]) => {
          const flatIndex = getFlatIndex(coordinates, board.numColumns);
          if (board.cells[flatIndex] !== undefined){
            throw "";
          }
          return {
            flatIndex: flatIndex,
            player: currentPlayer
          };
        }),
        retry(),
        take(1)
      ))
  );

  private computerMove$: Observable<Move> = this.currentPlayer$.pipe(
    filter(currentPlayer => currentPlayer.opponentType === OpponentType.COMPUTER),
    withLatestFrom(this.board$),
    switchMap(([currentPlayer, board]) =>
      this.opponentService.getNextMove(currentPlayer, deepCloneBoard(board), this.settingsService.gameConfig).pipe(
        map(flatIndex => ({
          flatIndex: flatIndex,
          player: currentPlayer
        })),
        take(1)
      )
    ),
    delay(500)
  );

  private moves$: Observable<Move> = merge(this.humanMove$, this.computerMove$).pipe(
    withLatestFrom(this.gameOver$),
    filter(([move, gameOver]) => !gameOver),
    map(([move,]) => move)
  );

  constructor(
    @Inject(OPPONENT_DI_TOKEN) private opponentService: Opponent,
    private settingsService: SettingsService,
  ) {
    this.moves$.subscribe(move => {
      this.updateBoard(this.boardBS.getValue(), move);
      this.toggleCurrentPlayer();
    });
  }

  public cellClicked(boardCoordinates: BoardCoordinates): void {
    this.cellClicksSubject.next(boardCoordinates);
  }

  public startNewGame(): void {
    this.gameConfig = this.settingsService.gameConfig;
    this.players = this.gameConfig.players;
    this.currentPlayerBS.next(this.players[PlayerId.ONE]);
    const emptyBoard: FlatBoard<string> = generateEmptyBoard(3, 3);
    this.boardBS.next(emptyBoard);
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
    this.currentPlayerBS.next((this.currentPlayerBS.getValue() === player1) ? player2 : player1)
  }
}
