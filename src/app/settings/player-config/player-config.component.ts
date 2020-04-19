import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {OpponentType} from "../../ttt.types";
import {MARKS} from "../settings.service";

@Component({
  selector: 'ttt-player-config',
  templateUrl: './player-config.component.html',
  styleUrls: ['./player-config.component.scss']
})
export class PlayerConfigComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() title: string;
  public opponentTypes: OpponentType[] = [OpponentType.HUMAN, OpponentType.COMPUTER];
  public marks: string[] = MARKS;

  constructor() { }

  ngOnInit(): void {
  }

}
