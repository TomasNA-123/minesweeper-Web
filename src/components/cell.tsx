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
  click: (cords: number[], cellValue: number, isActive: boolean) => void;
  updateFlagsSet: (key: string, value: number) => void;
}

function Cell(props: Props) {
  const { cellData, resetSignal, gameOver, click, updateFlagsSet } = props;
  const [cellStatus, setCellStatus] = useState(0);

  const cellIcons = ["", "🚩", "❓"];

  // Define the cell icon
  useEffect(() => {
    if (resetSignal) setCellStatus(0);
  });

  // Change the cell status
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

  return (
    <div
      className={`${
        cellData.active
          ? "cell-active cell".concat(String(cellData.value))
          : cellStatus != 0
            ? "cell cell-icon"
            : "cell"
      }`}
      onClick={() => {
        if (cellStatus != 1)
          click(cellData.cords, cellData.value, cellData.active);
      }}
      onContextMenu={handleRightClick}
    >
      {cellData.active ? cellValue(cellData.value) : cellIcons[cellStatus]}
    </div>
  );
}

export default Cell;
