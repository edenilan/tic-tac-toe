import {Component, Input, OnInit} from '@angular/core';
import {GameEngineService} from "./game-engine.service";

@Component({
  selector: 'ttt-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  constructor(public gameEngineService: GameEngineService) { }

  ngOnInit(): void {
  }

  cellClicked(rowIndex, columnIndex): void {
    console.log(`cell clicked: row ${rowIndex}, column ${columnIndex}`);
    this.gameEngineService.cellClicked({row: rowIndex, column: columnIndex});
  }
}
