import {Injectable} from '@angular/core';
import {FlatBoard, GameConfig, Player} from "../ttt.types";
import {getFlatBoardEmptyIndices, isGameWon} from "./game.helpers";
import {Opponent} from "./opponent";

@Injectable()
export class ComputerOpponentService implements Opponent{
  private currentPlayer: Player;
  private otherPlayer: Player;
  constructor() {
  }
  public getNextMove(currentPlayer: Player, board: FlatBoard<string>, gameConfig: GameConfig): number {
    this.setConfig(currentPlayer, gameConfig);
    return this.computeBestMove(board, this.currentPlayer).index;
  }
  private setConfig(currentPlayer: Player, gameConfig: GameConfig){
    const {players} = gameConfig;
    this.currentPlayer = currentPlayer;
    this.otherPlayer = Object.values(players).find((player: Player) => player !== currentPlayer);
  }
  private computeBestMove(board: FlatBoard<string>, player: Player){
    var availableSpots = getFlatBoardEmptyIndices(board);

    if(isGameWon(board, this.otherPlayer)){
      return{score: -10};
    }else if(isGameWon(board, this.currentPlayer)){
      return {score: 10};
    }else if(availableSpots.length === 0){
      return {score: 0};
    }

    var moves = [];
    for(var i =0; i < availableSpots.length; i++){
      var move: any = {};
      move.index = availableSpots[i];
      board.cells[availableSpots[i]] = player.mark;

      if(player == this.currentPlayer){
        var result = this.computeBestMove(board, this.otherPlayer);
        move.score = result.score;
      }else{
        var result = this.computeBestMove(board, this.currentPlayer);
        move.score = result.score;
      }
      board.cells[availableSpots[i]] = undefined;
      moves.push(move);
    }

    var bestMove;
    if(player === this.currentPlayer){
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++) {
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++) {
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
}
