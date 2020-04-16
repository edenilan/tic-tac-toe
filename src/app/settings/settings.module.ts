import {NgModule} from '@angular/core';
import {SettingsComponent} from "./settings.component";
import {SettingsService} from "./settings.service";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  exports: [],
  declarations: [SettingsComponent],
  providers: [SettingsService],
})
export class SettingsModule {
}
