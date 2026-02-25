import "./settingsForm.css";

interface Props {
  rows: number;
  cols: number;
  mines: number;
}

function SettingsForm(props: Props) {
  const { rows, cols, mines } = props;

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label htmlFor="difficultyId" className="formLabel">
          Difficulty
        </label>
        <select id="difficultyId" className="formInput">
          <option value="easy">Easy</option>
          <option value="medium" selected>
            Medium
          </option>
          <option value="hard">Hard</option>
          <option value="custom">Custom</option>
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
            value={rows}
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
            value={cols}
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
            value={mines}
          />
        </div>
      </div>
      <div className="rowTwoCols">
        <div className="formGroup">
          <button className="btn btnReset">Reset</button>
        </div>
        <div className="formGroup">
          <button className="btn btnAccept">Accept</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;
