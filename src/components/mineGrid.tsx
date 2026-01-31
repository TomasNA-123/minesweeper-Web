import { useState, useEffect } from "react";
import "./mineGrid.css";
import Cell from "./cell";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function itsAMine(mines: number[][], cords: number[]) {
  return mines.some(([a, b]) => a === cords[0] && b === cords[1]);
}

function MineGrid() {
  let rows = 15;
  let columns = 15;

  let mines = 20;

  let minesCords: number[][] = [];

  const [minesList, setMinesList] = useState<number[][]>([]);
  const [firstClick, setFirstClick] = useState(false);

  useEffect(() => {
    setMinesList(
      Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => 0),
      ),
    );
  }, []);

  let minesOnClick = () => {
    let auxMinesList = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => 0),
    );
    if (!firstClick) {
      while (minesCords.length < mines) {
        let cords = [randomInt(0, rows - 1), randomInt(0, columns - 1)];
        if (!itsAMine(minesCords, cords)) {
          minesCords.push(cords);
        }
      }

      minesCords.map((cord) => (auxMinesList[cord[0]][cord[1]] = -1));

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
            if (auxMinesList[i][j] != -1) {
              auxMinesList[i][j] += 1;
            }
          }
        }
      });
      setMinesList(auxMinesList);
      setFirstClick(true);
    }
  };

  return (
    <div className="grid">
      {minesList.map((rowItem, rowIndex) =>
        rowItem.map((colItem, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            firstClick={firstClick}
            click={() => minesOnClick()}
            value={colItem}
          ></Cell>
        )),
      )}
    </div>
  );
}

export default MineGrid;
