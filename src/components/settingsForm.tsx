import { useState } from "react";
import "./settingsForm.css";
import Button from "./button";

interface Props {
  rows: number;
  cols: number;
  mines: number;
  difficulty: string;
  setRows: (value: number) => void;
  setCols: (value: number) => void;
  setMines: (value: number) => void;
  setDifficulty: (value: string) => void;
  resetGame: () => void;
}

function SettingsForm(props: Props) {
  const {
    rows,
    cols,
    mines,
    difficulty,
    setRows,
    setCols,
    setMines,
    setDifficulty,
    resetGame,
  } = props;

  const [localRows, setLocalRows] = useState(rows);
  const [localCols, setLocalCols] = useState(cols);
  const [localMines, setLocalMines] = useState(mines);
  const [localDifficulty, setLocalDifficulty] = useState(difficulty);

  // Set a min max value into the inputs
  const numericInputValues = (
    setInput: (value: number) => void,
    value: number,
    minValue: number,
    maxValue: number,
  ) => {
    if (value < minValue) value = minValue;

    if (value > maxValue) value = maxValue;

    setInput(value);
  };

  // Change the settings to the current ones
  const resetSettings = () => {
    setLocalRows(rows);
    setLocalCols(cols);
    setLocalMines(mines);
    onChangeDifficulty(difficulty);
  };

  // change the settings depending on thedifficulty
  const onChangeDifficulty = (value: string) => {
    setLocalDifficulty(value);

    switch (value) {
      case "Easy":
        setLocalRows(8);
        setLocalCols(8);
        setLocalMines(10);
        break;

      case "Medium":
        setLocalRows(16);
        setLocalCols(16);
        setLocalMines(40);
        break;

      case "Hard":
        setLocalRows(30);
        setLocalCols(16);
        setLocalMines(99);
        break;
    }
  };

  // change the settings values for the new ones
  const acceptSettings = () => {
    setRows(localRows);
    setCols(localCols);
    setMines(localMines);
    setDifficulty(localDifficulty);
    resetGame();
  };

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label htmlFor="difficultyId" className="formLabel">
          Difficulty
        </label>
        <select
          id="difficultyId"
          className="formInput"
          value={localDifficulty}
          onChange={(e) => onChangeDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Custom">Custom</option>
        </select>
      </div>
      <div className="rowTwoCols">
        <div className="formGroup">
          <label htmlFor="rowsId" className="formLabel">
            Rows
          </label>
          <input
            id="rowsId"
            className="formInput"
            type="number"
            min={1}
            value={localRows}
            onChange={(e) => setLocalRows(Number(e.target.value))}
            onBlur={(e) =>
              numericInputValues(setLocalRows, Number(e.target.value), 4, 99)
            }
            disabled={localDifficulty != "Custom"}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="colsId" className="formLabel">
            Cols
          </label>
          <input
            id="colsId"
            className="formInput"
            type="number"
            min={1}
            value={localCols}
            onChange={(e) => setLocalCols(Number(e.target.value))}
            onBlur={(e) =>
              numericInputValues(setLocalCols, Number(e.target.value), 4, 99)
            }
            disabled={localDifficulty != "Custom"}
          />
        </div>
      </div>
      <div className="rowTwoCols">
        <div className="formGroup">
          <label htmlFor="minesId" className="formLabel">
            Mines
          </label>
          <input
            id="minesId"
            className="formInput"
            type="number"
            min={1}
            value={localMines}
            onChange={(e) => setLocalMines(Number(e.target.value))}
            onBlur={(e) =>
              numericInputValues(setLocalMines, Number(e.target.value), 1, 999)
            }
            disabled={localDifficulty != "Custom"}
          />
        </div>
      </div>
      <div className="rowTwoCols">
        <Button
          typeButton="primary"
          content="Reset"
          click={() => resetSettings()}
        ></Button>
        <Button
          typeButton="success"
          content="Accept"
          click={() => acceptSettings()}
        ></Button>
      </div>
    </div>
  );
}

export default SettingsForm;
