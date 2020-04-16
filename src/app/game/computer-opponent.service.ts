import {Injectable} from '@angular/core';
import {Cell, GameConfig, OpponentType, Player, PlayersMap} from "./game.types";
import {checkWinForFlatBoard, flattenBoard, getFlatBoardEmptyIndices} from "./game.helpers";

@Injectable()
export class ComputerOpponentService {
  private computerPlayer: Player;
  private humanPlayer: Player;
  constructor() {
  }
  public getNextMove(board: string[][], gameConfig: GameConfig): Cell {
    this.setConfig(gameConfig);
    const bestMoveFlatIndex = this.computeBestMove(flattenBoard(board), this.computerPlayer).index;
    return {
      // TODO: remove magic numbers (3)
      row: Math.floor(bestMoveFlatIndex / 3),
      column: bestMoveFlatIndex % 3
    };
  }
  private setConfig(gameConfig: GameConfig){
    const {players} = gameConfig;
    this.computerPlayer = Object.values(players).find((player: Player) => player.opponentType === OpponentType.COMPUTER);
    this.humanPlayer = Object.values(players).find((player: Player) => player.opponentType === OpponentType.HUMAN);
  }
  private computeBestMove(board: string[], player: Player){
    var availableSpots = getFlatBoardEmptyIndices(board);

    if(checkWinForFlatBoard(board, this.humanPlayer)){
      return{score: -10};
    }else if(checkWinForFlatBoard(board, this.computerPlayer)){
      return {score: 10};
    }else if(availableSpots.length === 0){
      return {score: 0};
    }

    var moves = [];
    for(var i =0; i < availableSpots.length; i++){
      var move: any = {};
      move.index = availableSpots[i];
      board[availableSpots[i]] = player.mark;

      if(player == this.computerPlayer){
        var result = this.computeBestMove(board, this.humanPlayer);
        move.score = result.score;
      }else{
        var result = this.computeBestMove(board, this.computerPlayer);
        move.score = result.score;
      }
      board[availableSpots[i]] = undefined;
      moves.push(move);
    }

    var bestMove;
    if(player === this.computerPlayer){
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
