import "./mainInterface.css";

import MineGrid from "./mineGrid";
import Counter from "./counter";
import MineButton from "./mineButton";
import SideInterface from "./sideInterface";
import SettingsForm from "./settingsForm";
import { useState, useEffect } from "react";

function MainInterface() {
  const [mines, setMines] = useState(20);
  const [rows, setRows] = useState(15);
  const [columns, setColumns] = useState(15);
  const [difficulty, setDifficulty] = useState("Medium");

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const [buttonFace, setButtonFace] = useState("🙂");
  const [resetSignal, setResetSignal] = useState(true);

  const [gameOver, setGameOver] = useState(false);

  const [flagsSet, setFlagsSet] = useState({});

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
    setFlagsSet({});
  };

  const offResetSignal = () => {
    setResetSignal(false);
  };

  const updateFlagsSet = (key: string, value: number) => {
    let aux: Record<string, number> = { ...flagsSet };

    aux[key] = value;
    setFlagsSet(aux);
  };

  const updateAllFlags = (newFlags: Record<string, number>) => {
    setFlagsSet(newFlags);
  };

  const getFlagsSet = () => {
    return { ...flagsSet };
  };

  const minesRemining = (flags: Record<string, number>) => {
    let flagsCount = Object.values(flags).filter((x) => x === 1).length;

    return mines - flagsCount;
  };

  return (
    <div className="mainGrid">
      <div className="settingsSection">
        <SideInterface title="Settings">
          <SettingsForm
            rows={rows}
            cols={columns}
            mines={mines}
            difficulty={difficulty}
            setRows={setRows}
            setCols={setColumns}
            setMines={setMines}
            setDifficulty={setDifficulty}
          ></SettingsForm>
        </SideInterface>
      </div>

      <div className="mainInterface">
        <div className="minesweeperInterface">
          <div className="topRow">
            <Counter value={minesRemining(flagsSet)}></Counter>
            <MineButton
              buttonData={buttonFace}
              click={() => resetAll()}
            ></MineButton>
            <Counter value={time}></Counter>
          </div>

          <div className="mineGridRow">
            <MineGrid
              mines={mines}
              rows={rows}
              columns={columns}
              resetSignal={resetSignal}
              gameOver={gameOver}
              clickCell={onClickCell}
              offResetSignal={offResetSignal}
              updateFlagsSet={updateFlagsSet}
              getFlagsSet={getFlagsSet}
              updateAllFlags={updateAllFlags}
            ></MineGrid>
          </div>
        </div>
      </div>

      <div className="scoreboardSection">
        <SideInterface title="Scoreboard"></SideInterface>
      </div>
    </div>
  );
}

export default MainInterface;
