import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SettingsService, MARKS} from "./settings.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OpponentType, PlayerId} from "../ttt.types";

@Component({
  selector: 'ttt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public opponentTypes: OpponentType[] = [OpponentType.HUMAN, OpponentType.COMPUTER];
  public marks: string[] = MARKS;
  public playerIds = PlayerId; // for referencing in template
  public gameConfigForm: FormGroup = this.groupify(this.settingsService.gameConfig);

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }
  public startGame(){
    this.settingsService.gameConfig = this.gameConfigForm.value;
    this.router.navigate(["/game"]);
  }
  private groupify(object: Object): FormGroup {
    const objectWithGroupifiedContent = Object.entries(object).reduce(
      (acc, [key, val]: any) => {
        if (val instanceof Object && !Array.isArray(val)){
          val = this.groupify(val);
        }
        return {...acc, [key]: val}
      }, {}
    );
    return this.fb.group(objectWithGroupifiedContent);
  }
}
