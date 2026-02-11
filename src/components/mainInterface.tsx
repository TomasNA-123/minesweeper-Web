import "./mainInterface.css";

import MineGrid from "./mineGrid";
import Counter from "./counter";
import MineButton from "./mineButton";
import { useState, useEffect } from "react";

function MainInterface() {
  let mines = 20;

  let [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const [buttonFace, setButtonFace] = useState("🙂");

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
    }
  };

  const resetAll = () => {
    setTime(0);
    setRunning(false);
    setButtonFace("🙂");
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

      <MineGrid mines={mines} clickCell={onClickCell}></MineGrid>
    </div>
  );
}

export default MainInterface;
