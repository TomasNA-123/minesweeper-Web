import { useEffect, useState } from "react";
import "./scoreboard.css";

type gameResult = {
  id: number;
  name: string;
  difficulty: string;
  time: number;
  mines: number;
  cols: number;
  rows: number;
};

interface Props {
  gameResults: gameResult[];
}

function Scoreboard(props: Props) {
  const { gameResults } = props;

  const [localGameResults, setLocalGameResults] =
    useState<gameResult[]>(gameResults);

  useEffect(() => {
    let localResults = [...gameResults];

    localResults.sort((a, b) => a.time - b.time);

    setLocalGameResults(localResults);
  }, [gameResults]);

  return (
    <div className="scoreboard">
      <table className="sbTable">
        <thead>
          <tr>
            <th>N°</th>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Time</th>
            <th>Mines</th>
            <th>Rows</th>
            <th>Cols</th>
          </tr>
        </thead>

        <tbody>
          {localGameResults.length === 0 && (
            <tr key={`sbRow-${1}`}>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          )}

          {localGameResults.map((value, index) => (
            <tr key={`sbRow-${index}`}>
              <td>{index + 1}</td>
              <td>{value.name}</td>
              <td>{value.difficulty}</td>
              <td>{value.time}</td>
              <td>{value.mines}</td>
              <td>{value.rows}</td>
              <td>{value.cols}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scoreboard;
