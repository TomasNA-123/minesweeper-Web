import "./mainInterface.css";

import MineGrid from "./mineGrid";
import Counter from "./counter";
import MineButton from "./mineButton";
import { useState, useEffect } from "react";

function MainInterface() {
  const [mines, setMines] = useState(20);
  const [rows, setRows] = useState(15);
  const [columns, setColumns] = useState(15);

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const [buttonFace, setButtonFace] = useState("🙂");
  const [resetSignal, setResetSignal] = useState(true);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev >= 999) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, time]);

  const onClickCell = (value: number, isActive: boolean) => {
    if (!running) setRunning(true);

    if (isActive) return true;

    if (value !== -1) {
      setButtonFace("😮");
      setTimeout(() => {
        setButtonFace("🙂");
      }, 200);
    } else {
      setButtonFace("😵");
      setRunning(false);
      setGameOver(true);
    }
  };

  const resetAll = () => {
    setTime(0);
    setRunning(false);
    setButtonFace("🙂");
    setResetSignal(true);
    setGameOver(false);
  };

  const offResetSignal = () => {
    setResetSignal(false);
  };

  return (
    <div className="mainInterface">
      <div className="topRow">
        <Counter value={mines}></Counter>
        <MineButton
          buttonData={buttonFace}
          click={() => resetAll()}
        ></MineButton>
        <Counter value={time}></Counter>
      </div>

      <MineGrid
        mines={mines}
        rows={rows}
        columns={columns}
        resetSignal={resetSignal}
        gameOver={gameOver}
        clickCell={onClickCell}
        offResetSignal={offResetSignal}
      ></MineGrid>
    </div>
  );
}

export default MainInterface;
