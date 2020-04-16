import {NgModule} from '@angular/core';
import {SettingsComponent} from "./settings.component";
import {SettingsService} from "./settings.service";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [RouterModule],
  exports: [],
  declarations: [SettingsComponent],
  providers: [SettingsService],
})
export class SettingsModule {
}
