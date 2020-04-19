import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {GameModule} from "./game/game.module";
import { SettingsComponent } from './settings/settings.component';
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";
import {SettingsModule} from "./settings/settings.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GameModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    SettingsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
