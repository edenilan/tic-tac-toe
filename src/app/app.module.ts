import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GameModule} from "./game/game.module";
import { SettingsComponent } from './settings/settings.component';
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";

const appRoutes: Routes = [
  { path: 'settings', component: SettingsComponent },
  {
    path: 'game',
    component: GameComponent,
  },
  { path: '',
    redirectTo: '/settings',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GameModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
