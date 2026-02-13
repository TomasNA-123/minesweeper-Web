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
  click: (cords: number[], cellValue: number, isActive: boolean) => void;
}

function Cell(props: Props) {
  const { cellData, resetSignal, click } = props;
  const [cellStatus, setCellStatus] = useState(0);

  const cellIcons = ["", "🚩", "❓"];

  useEffect(() => {
    if (resetSignal) setCellStatus(0);
  });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    cellStatus < 2 ? setCellStatus(cellStatus + 1) : setCellStatus(0);

    console.log(cellStatus);
  };

  const cellValue = (value: number) => {
    switch (value) {
      case -1:
        return "💣";
        break;
      case 0:
        return "";
        break;
      default:
        return value;
    }
  };

  return (
    <div
      className={`${cellData.active ? "cell-active cell".concat(String(cellData.value)) : "cell"}`}
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
