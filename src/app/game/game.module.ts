import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameComponent} from "./game.component";
import {GameEngineService} from "./game-engine.service";
import {ComputerOpponentService} from "./computer-opponent.service";



@NgModule({
  declarations: [
    GameComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    GameComponent
  ],
  providers: [
    GameEngineService,
    ComputerOpponentService
  ]
})
export class GameModule { }
