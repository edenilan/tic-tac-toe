import {Player} from "../ttt.types";

const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

export function flattenBoard(board: string[][]): string[] {
  return board.reduce((acc, currentRow) => [...acc, ...currentRow], []);
}

export function checkWinForFlatBoard(flatBoard: string[], player: Player): boolean {
  const playerCellIndices = flatBoard.reduce(
    (acc, currCellValue, index) => (currCellValue === player.mark) ? [...acc, index] : acc
    ,[]
  );
  return winCombos.some(combo =>
    combo.every(index =>
      playerCellIndices.includes(index)
    )
  );
}

export function isGameWon(board: string[][], player: Player): boolean {
  const flattenedBoard = flattenBoard(board);
  return checkWinForFlatBoard(flattenedBoard, player);
}

export function isTie(board: string[][], player: Player): boolean {
  const flattenedBoard = flattenBoard(board);
  return !isGameWon(board, player) && flattenedBoard.every((cellValue: string) => cellValue !== undefined);
}

export function deepCloneBoard(board: string[][]){
  let freshBoard = [];
  board.forEach((row: string[]) => {
    freshBoard = [...freshBoard, [...row]];
  });
  return freshBoard;
}

export function getFlatBoardEmptyIndices(flatBoard: string[]): number[] {
  let emptyIndices: number[] = [];
  flatBoard.forEach((cell: string, index: number) => {
    if (cell === undefined){
      emptyIndices.push(index);
    }
  });
  return emptyIndices;
}
