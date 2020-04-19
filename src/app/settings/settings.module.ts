import {NgModule} from '@angular/core';
import {SettingsComponent} from "./settings.component";
import {SettingsService} from "./settings.service";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { PlayerConfigComponent } from './player-config/player-config.component';

@NgModule({
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [],
  declarations: [SettingsComponent, PlayerConfigComponent, PlayerConfigComponent],
  providers: [SettingsService],
})
export class SettingsModule {
}
