import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameComponent} from "./game.component";
import {GameEngineService} from "./game-engine.service";
import {ComputerOpponentService} from "./computer-opponent.service";
import {RouterModule} from "@angular/router";
import {SettingsService} from "../settings/settings.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";



@NgModule({
  declarations: [
    GameComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
  ],
  exports: [
    GameComponent
  ],
  providers: [
    GameEngineService,
    ComputerOpponentService,
    SettingsService
  ]
})
export class GameModule { }
