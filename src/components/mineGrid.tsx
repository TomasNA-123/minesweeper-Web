import { useState, useEffect, Activity } from "react";
import "./mineGrid.css";
import Cell from "./cell";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function itsAMine(mines: number[][], cords: number[]) {
  return mines.some(([a, b]) => a === cords[0] && b === cords[1]);
}

interface Props {
  mines: number;
  rows: number;
  columns: number;
  resetSignal: boolean;
  gameOver: boolean;
  win: boolean;
  clickCell: (value: number, isActive: boolean) => void;
  offResetSignal: () => void;
  updateFlagsSet: (key: string, value: number) => void;
  getFlagsSet: () => Record<string, number>;
  updateAllFlags: (newFlags: Record<string, number>) => void;
  setMinesPlaced: (value: number) => void;
  increaseCellsActive: (value: number) => void;
}

function MineGrid(props: Props) {
  const {
    mines,
    rows,
    columns,
    resetSignal,
    gameOver,
    win,
    clickCell,
    offResetSignal,
    updateFlagsSet,
    getFlagsSet,
    updateAllFlags,
    setMinesPlaced,
    increaseCellsActive,
  } = props;

  let minesCords: number[][] = [];

  type cell = {
    cords: number[];
    value: number;
    active: boolean;
  };

  const [minesList, setMinesList] = useState<cell[][]>([]);
  const [firstClick, setFirstClick] = useState(false);

  // Reset all cell values
  useEffect(() => {
    if (resetSignal) {
      setMinesList(
        Array.from({ length: rows }, (rowItem, rowIndex) =>
          Array.from({ length: columns }, (colItem, colIndex) => ({
            cords: [rowIndex, colIndex],
            value: 0,
            active: false,
          })),
        ),
      );

      setFirstClick(false);
      offResetSignal();
    }
  }, [resetSignal]);

  // Active all the cells with value 0 around a selected cell
  const recursiveActiveCells = (
    cords: number[],
    minesGrid: cell[][],
    flags: Record<string, number>,
    cActive: number,
  ): [cell[][], Record<string, number>, number] => {
    if (
      minesGrid[cords[0]][cords[1]].value == 0 &&
      minesGrid[cords[0]][cords[1]].active == false
    ) {
      for (
        let i = Math.max(cords[0] - 1, 0);
        i <= Math.min(cords[0] + 1, rows - 1);
        i++
      ) {
        for (
          let j = Math.max(cords[1] - 1, 0);
          j <= Math.min(cords[1] + 1, columns - 1);
          j++
        ) {
          if (!minesGrid[cords[0]][cords[1]].active) {
            cActive += 1;
          }
          flags[`${i}-${j}`] = 0;
          minesGrid[cords[0]][cords[1]].active = true;
          [minesGrid, flags, cActive] = recursiveActiveCells(
            [i, j],
            minesGrid,
            flags,
            cActive,
          );
        }
      }
    }

    if (!minesGrid[cords[0]][cords[1]].active) {
      cActive += 1;
    }
    minesGrid[cords[0]][cords[1]].active = true;

    return [minesGrid, flags, cActive];
  };

  // active a cell and assigns values ​​to the cells if is the first click
  let minesOnClick = (cellCords: number[]) => {
    let auxMinesList = minesList.map((row) => row.map((cell) => ({ ...cell })));

    // Asign the values to all cells
    if (!firstClick) {
      // auxMinesList[cellCords[0]][cellCords[1]].active = true;
      let minesCreationTry = 0;
      while (minesCords.length < mines && minesCreationTry <= 100) {
        let cords = [randomInt(0, rows - 1), randomInt(0, columns - 1)];
        minesCreationTry += 1;
        if (
          !itsAMine(minesCords, cords) &&
          Math.abs(cellCords[0] - cords[0]) > 1 &&
          Math.abs(cellCords[1] - cords[1]) > 1
        ) {
          minesCords.push(cords);
          auxMinesList[cords[0]][cords[1]].value = -1;

          minesCreationTry = 0;
        }
      }

      minesCords.map((cord) => {
        for (
          let i = Math.max(cord[0] - 1, 0);
          i <= Math.min(cord[0] + 1, rows - 1);
          i++
        ) {
          for (
            let j = Math.max(cord[1] - 1, 0);
            j <= Math.min(cord[1] + 1, columns - 1);
            j++
          ) {
            if (auxMinesList[i][j].value !== -1) {
              auxMinesList[i][j].value += 1;
            }
          }
        }
      });
      setMinesPlaced(minesCords.length);
      setMinesList(auxMinesList);
      setFirstClick(true);
    }

    // Active the selected cell
    let auxFlags: Record<string, number>;
    let auxCellsActive: number;
    [auxMinesList, auxFlags, auxCellsActive] = recursiveActiveCells(
      cellCords,
      auxMinesList,
      getFlagsSet(),
      0,
    );

    increaseCellsActive(auxCellsActive);
    setMinesList(auxMinesList);
    updateAllFlags(auxFlags);
  };

  // handles the click event in the cell
  const cellClickFunctions = (
    cords: number[],
    cellValue: number,
    isActive: boolean,
  ) => {
    if (!gameOver) {
      minesOnClick(cords);
      clickCell(cellValue, isActive);
    }
  };

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {minesList.map((rowItem, rowIndex) =>
        rowItem.map((colItem, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cellData={minesList[rowIndex][colIndex]}
            resetSignal={resetSignal}
            gameOver={gameOver}
            win={win}
            click={cellClickFunctions}
            updateFlagsSet={updateFlagsSet}
          ></Cell>
        )),
      )}
    </div>
  );
}

export default MineGrid;
