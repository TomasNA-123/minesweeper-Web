import { useState, useEffect } from "react";
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
  clickCell: (value: number, isActive: boolean) => void;
}

function MineGrid(props: Props) {
  const { mines, clickCell } = props;

  let rows = 15;
  let columns = 15;

  let minesCords: number[][] = [];

  type cell = {
    cords: number[];
    value: number;
    active: boolean;
  };

  const [minesList, setMinesList] = useState<cell[][]>([]);
  const [firstClick, setFirstClick] = useState(false);

  useEffect(() => {
    setMinesList(
      Array.from({ length: rows }, (rowItem, rowIndex) =>
        Array.from({ length: columns }, (colItem, colIndex) => ({
          cords: [rowIndex, colIndex],
          value: 0,
          active: false,
        })),
      ),
    );
  }, []);

  const recursiveActiveCells = (cords: number[], minesGrid: cell[][]) => {
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
          minesGrid[cords[0]][cords[1]].active = true;
          minesGrid = recursiveActiveCells([i, j], minesGrid);
        }
      }
    }

    minesGrid[cords[0]][cords[1]].active = true;

    return minesGrid;
  };

  let minesOnClick = (cellCords: number[]) => {
    let auxMinesList = minesList.map((row) => row.map((cell) => ({ ...cell })));
    if (!firstClick) {
      // auxMinesList[cellCords[0]][cellCords[1]].active = true;
      while (minesCords.length < mines) {
        let cords = [randomInt(0, rows - 1), randomInt(0, columns - 1)];
        if (
          !itsAMine(minesCords, cords) &&
          cellCords[0] != cords[0] &&
          cellCords[1] != cords[1]
        ) {
          minesCords.push(cords);
          auxMinesList[cords[0]][cords[1]].value = -1;
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
      setMinesList(auxMinesList);
      setFirstClick(true);
    }

    auxMinesList = recursiveActiveCells(cellCords, auxMinesList);

    setMinesList(auxMinesList);
  };

  const cellClickFunctions = (
    cords: number[],
    cellValue: number,
    isActive: boolean,
  ) => {
    minesOnClick(cords);
    clickCell(cellValue, isActive);
  };

  return (
    <div className="grid">
      {minesList.map((rowItem, rowIndex) =>
        rowItem.map((colItem, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cellData={minesList[rowIndex][colIndex]}
            click={cellClickFunctions}
          ></Cell>
        )),
      )}
    </div>
  );
}

export default MineGrid;
