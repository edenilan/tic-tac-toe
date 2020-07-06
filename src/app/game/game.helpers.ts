import {BoardCoordinates, FlatBoard, Player} from "../ttt.types";

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

export function generateEmptyBoard(numRows: number, numColumns: number): FlatBoard<string> {
  const cells = Array.from({length: numRows * numColumns}, () => undefined);
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

export function getWinningIndices(flatBoard: FlatBoard<string>, player: Player): number[] {
  const playerCellIndices = flatBoard.cells.reduce(
    (acc, currCellValue, index) => (currCellValue === player.mark) ? [...acc, index] : acc
    ,[]
  );
  const winningIndices = winCombos.find(combo =>
    combo.every(index =>
      playerCellIndices.includes(index)
    )
  );
  return winningIndices || [];
}

export function isGameWon(flatBoard: FlatBoard<string>, player: Player): boolean {
  const winningIndices = getWinningIndices(flatBoard, player);
  return winningIndices && winningIndices.length > 0;
}

export function findWinner(flatBoard: FlatBoard<string>, players: Player[]): Player | undefined {
  return players.find(player => isGameWon(flatBoard, player));
}
export function isTie(board: FlatBoard<string>, players: Player[]): boolean {
  return !players.some(player => isGameWon(board, player)) && board.cells.every((cell: string) => cell !== undefined);
}

export function deepCloneBoard(board: FlatBoard<string>): FlatBoard<string>{
  return {
    ...board,
    cells: [...board.cells]
  };
}

export function getFlatBoardEmptyIndices(flatBoard: FlatBoard<string>): number[] {
  let emptyIndices: number[] = [];
  flatBoard.cells.forEach((cell: string, index: number) => {
    if (cell === undefined){
      emptyIndices.push(index);
    }
  });
  return emptyIndices;
}

export function to2DBoard<T>(flatBoard: FlatBoard<T>): T[][] {
  const {numRows, numColumns, cells} = flatBoard;
  return Array
      .from<T>({length: flatBoard.numRows})
      .map((r, i) => cells.slice(numRows * i, (numRows * i) + numColumns));
}
