import {BoardCell, BoardCoordinates, emptyBoardCell, FlatBoard, Player, TwoDimensionalBoard} from "../ttt.types";

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

export function generateEmptyBoard(numRows: number, numColumns: number): FlatBoard {
  const cells = Array(numRows * numColumns).fill({...emptyBoardCell});
  return {
    cells: cells,
    numRows: numRows,
    numColumns: numColumns
  };
}

export function getFlatIndex(boardCoordinates: BoardCoordinates, numColumns): number {
  const {row, column} = boardCoordinates;
  return row * numColumns + column;
}
export function flattenBoard(board: string[][]): string[] {
  return board.reduce((acc, currentRow) => [...acc, ...currentRow], []);
}

export function isGameWon(flatBoard: FlatBoard, player: Player): boolean {
  const playerCellIndices = flatBoard.cells.reduce(
    (acc, currCell, index) => (currCell.value === player.mark) ? [...acc, index] : acc
    ,[]
  );
  return winCombos.some(combo =>
    combo.every(index =>
      playerCellIndices.includes(index)
    )
  );
}

export function isTie(board: FlatBoard, player: Player): boolean {
  return !isGameWon(board, player) && board.cells.every((cell: BoardCell) => cell.value !== undefined);
}

export function deepCloneBoard(board: FlatBoard): FlatBoard{
  const freshCells: BoardCell[] = board.cells.map((cell: BoardCell) => ({...cell}));
  const freshBoard: FlatBoard = {
    ...board,
    cells: freshCells
  };
  return freshBoard;
}

export function getFlatBoardEmptyIndices(flatBoard: FlatBoard): number[] {
  let emptyIndices: number[] = [];
  flatBoard.cells.forEach((cell: BoardCell, index: number) => {
    if (cell.value === undefined){
      emptyIndices.push(index);
    }
  });
  return emptyIndices;
}

export function to2DBoard(flatBoard: FlatBoard): TwoDimensionalBoard {
  const {numRows, numColumns, cells} = flatBoard;
  return Array.from({length: flatBoard.numRows}, (x, i) => flatBoard.cells.slice(numRows * i, (numRows * i) + numColumns));
}
