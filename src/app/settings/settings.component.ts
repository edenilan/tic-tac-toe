import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SettingsService} from "./settings.service";

@Component({
  selector: 'ttt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router, private settingsService: SettingsService) { }

  ngOnInit(): void {
  }

  public start2PlayerGame(){
    this.settingsService.set2PlayerMode();
    this.router.navigate(["/game"]);
  }
  public startPlayerVsComputerGame(){
    this.settingsService.setPlayerVsComputerMode();
    this.router.navigate(["/game"]);
  }

}
