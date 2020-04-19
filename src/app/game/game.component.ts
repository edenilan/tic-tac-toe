import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {GameEngineService} from "./game-engine.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {combineLatest, merge, Observable} from "rxjs";
import {filter, map, mapTo, startWith} from "rxjs/operators";
import {FlatBoard, Player} from "../ttt.types";
import {to2DBoard} from "./game.helpers";

export interface BoardCellWithWinningIndication {
  value: string;
  isInWinningCombo: boolean;
}

@Component({
  selector: 'ttt-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, OnDestroy {
  private winnerMessage$: Observable<string> = this.gameEngineService.winner$.pipe(
    filter(Boolean),
    map((winner: Player) => `${winner.mark} ${winner.name} wins! `)
  );
  private tieGameMessage$: Observable<string> = this.gameEngineService.tieGame$.pipe(
    filter(Boolean),
    mapTo("Tie game!")
  );
  private showSnackBar$: Observable<string> = merge(this.winnerMessage$, this.tieGameMessage$);
  private winningIndices$: Observable<number[]> = this.gameEngineService.winningIndices$.pipe(
    startWith([])
  );
  public board$: Observable<BoardCellWithWinningIndication[][]> = combineLatest([this.gameEngineService.board$, this.winningIndices$]).pipe(
    map(([board, winningIndices]: [FlatBoard<string>, number[]]) => {
      const cells: BoardCellWithWinningIndication[] = board.cells.map((cellValue: string, index: number) => ({
          value: cellValue,
          isInWinningCombo: winningIndices.includes(index)
        })
      );
      return {
        ...board,
        cells: cells
      }
    }),
    map((board: FlatBoard<BoardCellWithWinningIndication>) => to2DBoard(board))
  );
  constructor(
    public gameEngineService: GameEngineService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
  ) {
    this.activatedRoute.url.subscribe( url =>{
        this.gameEngineService.startNewGame();
    });
  }

  ngOnInit(): void {
    this.showSnackBar$.subscribe((message: string) => {
      this.matSnackBar.open(message);
    })
  }

  ngOnDestroy(): void {
    this.matSnackBar.dismiss();
  }

  cellClicked(rowIndex, columnIndex): void {
    console.log(`cell clicked: row ${rowIndex}, column ${columnIndex}`);
    this.gameEngineService.cellClicked({row: rowIndex, column: columnIndex});
  }
  replayButtonClicked(): void {
    this.matSnackBar.dismiss();
    this.gameEngineService.startNewGame();
  }
}
