import { useState } from "react";
import "./cell.css";

interface Props {
  value: number;
  firstClick: boolean;
  click: () => void;
}

function Cell(props: Props) {
  const { value, firstClick, click } = props;
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={`cell ${isActive ? "cell".concat(String(value)) : ""}`}
      onClick={
        !firstClick
          ? click
          : () => {
              setIsActive(true);
            }
      }
    >
      {value}
    </div>
  );
}

export default Cell;
