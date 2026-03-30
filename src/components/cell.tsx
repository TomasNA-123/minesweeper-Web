import { useEffect, useState } from "react";
import "./cell.css";

type cell = {
  cords: number[];
  value: number;
  active: boolean;
};

interface Props {
  cellData: cell;
  resetSignal: boolean;
  gameOver: boolean;
  win: boolean;
  click: (cords: number[], cellValue: number, isActive: boolean) => void;
  updateFlagsSet: (key: string, value: number) => void;
}

function Cell(props: Props) {
  const { cellData, resetSignal, gameOver, win, click, updateFlagsSet } = props;
  const [cellStatus, setCellStatus] = useState(0);

  const cellIcons = ["", "🚩", "❓"];

  // Define the cell icon
  useEffect(() => {
    if (resetSignal) setCellStatus(0);
  });

  // Change the cell status with right click
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!cellData.active && !gameOver) {
      let cellStatusValue = cellStatus < 2 ? cellStatus + 1 : 0;

      setCellStatus(cellStatusValue);
      updateFlagsSet(
        `${cellData.cords[0]}-${cellData.cords[1]}`,
        cellStatusValue,
      );
    }
  };

  // displays the cell value
  const cellValue = (value: number) => {
    switch (value) {
      case -1:
        return "💣";
      case 0:
        return "";
      default:
        return value;
    }
  };

  // Define the cell class
  const getCellClass = () => {
    // Shows the cell value
    if (cellData.active) {
      return "cell-active cell".concat(String(cellData.value));
    }

    // Reveal all unmarked mines after game over
    if (
      !cellData.active &&
      gameOver &&
      cellStatus != 1 &&
      cellData.value == -1 &&
      !win
    ) {
      return "cell-active cell0 mine-revealed";
    }

    // Highlights incorrectly placed flags
    if (cellData.value != -1 && cellStatus == 1 && gameOver && !win) {
      return "cell cell-icon wrong-flag";
    }

    // Shows the cell icon
    if (cellStatus != 0) {
      return "cell cell-icon";
    }

    // Default cell style
    return "cell";
  };

  // Define the cell value
  const getCellValue = () => {
    if (cellData.active) {
      return cellValue(cellData.value);
    }

    if (
      !cellData.active &&
      gameOver &&
      cellStatus != 1 &&
      cellData.value == -1 &&
      !win
    ) {
      return cellValue(cellData.value);
    }

    return cellIcons[cellStatus];
  };

  return (
    <div
      className={getCellClass()}
      onClick={() => {
        if (cellStatus != 1)
          click(cellData.cords, cellData.value, cellData.active);
      }}
      onContextMenu={handleRightClick}
    >
      {getCellValue()}
    </div>
  );
}

export default Cell;
