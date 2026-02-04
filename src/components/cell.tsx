import { useState } from "react";
import "./cell.css";

type cell = {
  cords: number[];
  value: number;
  active: boolean;
};

interface Props {
  cellData: cell;
  click: (cords: number[]) => void;
}

function Cell(props: Props) {
  const { cellData, click } = props;
  // const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={`${cellData.active ? "cell-active cell".concat(String(cellData.value)) : "cell"}`}
      onClick={() => click(cellData.cords)}
    >
      {cellData.active ? cellData.value : ""}
    </div>
  );
}

export default Cell;
