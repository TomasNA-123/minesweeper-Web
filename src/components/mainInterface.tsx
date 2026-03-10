import "./mainInterface.css";

import MineGrid from "./mineGrid";
import Counter from "./counter";
import MineButton from "./mineButton";
import SideInterface from "./sideInterface";
import SettingsForm from "./settingsForm";
import Scoreboard from "./scoreboard";
import { useState, useEffect } from "react";

type gameResult = {
  id: number;
  name: string;
  difficulty: string;
  time: number;
  mines: number;
  cols: number;
  rows: number;
};

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
  const [win, setWin] = useState(false);

  const [flagsSet, setFlagsSet] = useState({});
  const [minesPlaced, setMinesPlaced] = useState(0);
  const [cellsActive, setCellsActive] = useState(0);

  const [gameResults, setGameResults] = useState<gameResult[]>([]);

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

  useEffect(() => {
    setMinesPlaced(mines);
  }, [mines]);

  const addGameResult = () => {
    let auxGameResults = [...gameResults];

    let latestId = 1;

    if (auxGameResults.length > 0) {
      const latestIdObjt = auxGameResults.reduce((max, obj) => {
        return obj.id > max.id ? obj : max;
      });

      latestId = latestIdObjt.id;
    }

    setGameResults((prev) => [
      ...prev,
      {
        id: latestId + 1,
        name: "TNA",
        difficulty: difficulty,
        time: time,
        mines: minesPlaced,
        cols: columns,
        rows: rows,
      },
    ]);
  };

  // Win condition
  useEffect(() => {
    const totalCells = rows * columns;

    if (totalCells - minesPlaced <= cellsActive && !gameOver) {
      setRunning(false);
      setGameOver(true);
      setWin(true);

      // ________________
      addGameResult();
    }
  }, [cellsActive, minesPlaced, rows, columns, gameOver]);

  useEffect(() => {
    if (win && buttonFace) setButtonFace("😎");
  }, [win, buttonFace]);

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
    setCellsActive(0);
    setWin(false);
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

    return minesPlaced - flagsCount;
  };

  const increaseCellsActive = (value: number) => {
    setCellsActive((prev) => prev + value);
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
            resetGame={resetAll}
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
              setMinesPlaced={setMinesPlaced}
              increaseCellsActive={increaseCellsActive}
            ></MineGrid>
          </div>
        </div>
      </div>

      <div className="scoreboardSection">
        <SideInterface title="Scoreboard">
          <Scoreboard gameResults={gameResults}></Scoreboard>
        </SideInterface>
      </div>
    </div>
  );
}

export default MainInterface;
