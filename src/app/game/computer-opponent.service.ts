import {Injectable} from '@angular/core';
import {BoardCoordinates, GameConfig, OpponentType, Player, PlayersMap} from "../ttt.types";
import {checkWinForFlatBoard, flattenBoard, getFlatBoardEmptyIndices} from "./game.helpers";

@Injectable()
export class ComputerOpponentService {
  private currentPlayer: Player;
  private otherPlayer: Player;
  constructor() {
  }
  public getNextMove(currentPlayer: Player, board: string[][], gameConfig: GameConfig): BoardCoordinates {
    this.setConfig(currentPlayer, gameConfig);
    const bestMoveFlatIndex = this.computeBestMove(flattenBoard(board), this.currentPlayer).index;
    return {
      // TODO: remove magic numbers (3)
      row: Math.floor(bestMoveFlatIndex / 3),
      column: bestMoveFlatIndex % 3
    };
  }
  private setConfig(currentPlayer: Player, gameConfig: GameConfig){
    const {players} = gameConfig;
    this.currentPlayer = currentPlayer;
    this.otherPlayer = Object.values(players).find((player: Player) => player !== currentPlayer);
  }
  private computeBestMove(board: string[], player: Player){
    var availableSpots = getFlatBoardEmptyIndices(board);

    if(checkWinForFlatBoard(board, this.otherPlayer)){
      return{score: -10};
    }else if(checkWinForFlatBoard(board, this.currentPlayer)){
      return {score: 10};
    }else if(availableSpots.length === 0){
      return {score: 0};
    }

    var moves = [];
    for(var i =0; i < availableSpots.length; i++){
      var move: any = {};
      move.index = availableSpots[i];
      board[availableSpots[i]] = player.mark;

      if(player == this.currentPlayer){
        var result = this.computeBestMove(board, this.otherPlayer);
        move.score = result.score;
      }else{
        var result = this.computeBestMove(board, this.currentPlayer);
        move.score = result.score;
      }
      board[availableSpots[i]] = undefined;
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
