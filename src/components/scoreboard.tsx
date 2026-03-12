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
  isReduced: boolean;
}

function Scoreboard(props: Props) {
  const { gameResults, isReduced } = props;

  const MAXBASE = 5;
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(MAXBASE);

  const [latestResult, setLatestResult] = useState<[number, gameResult]>([
    -1,
    {
      id: -1,
      name: "",
      difficulty: "",
      time: 0,
      mines: 0,
      cols: 0,
      rows: 0,
    },
  ]);

  const [localGameResults, setLocalGameResults] =
    useState<gameResult[]>(gameResults);

  const [currentPage, setCurrentPage] = useState(1);

  const updateScoreboard = () => {
    let localResults = [...gameResults];

    let auxLatestResult = localResults.reduce((last, obj) => {
      return obj.id > last.id ? obj : last;
    });

    localResults.sort((a, b) => a.time - b.time);

    let positionLatestResult = localResults.findIndex(
      (item) => item.id == auxLatestResult.id,
    );

    setLatestResult([positionLatestResult, auxLatestResult]);

    if (isReduced && localResults.length > 0) {
      localResults = localResults.slice(
        minRange,
        Math.min(localResults.length, maxRange),
      );
    }

    setLocalGameResults(localResults);
  };

  const updateRange = (page: number) => {
    const newMaxRange = MAXBASE * page;

    setMinRange(Math.max(0, newMaxRange - MAXBASE));
    // setMaxRange(Math.min(gameResults.length, newMaxRange));
    setMaxRange(newMaxRange);
  };

  useEffect(() => {
    if (gameResults.length > 0) updateScoreboard();
  }, [gameResults, minRange, maxRange]);

  useEffect(() => {
    updateRange(currentPage);
  }, [currentPage]);

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
            <tr
              key={`sbRow-${index}`}
              className={value.id == latestResult[1].id ? "latestResult" : ""}
            >
              <td>{index + minRange + 1}</td>
              <td>{value.name}</td>
              <td>{value.difficulty}</td>
              <td>{value.time}</td>
              <td>{value.mines}</td>
              <td>{value.rows}</td>
              <td>{value.cols}</td>
            </tr>
          ))}

          {isReduced && latestResult[0] >= maxRange && (
            <tr className="latestResult">
              <td>{latestResult[0] + 1}</td>
              <td>{latestResult[1].name}</td>
              <td>{latestResult[1].difficulty}</td>
              <td>{latestResult[1].time}</td>
              <td>{latestResult[1].mines}</td>
              <td>{latestResult[1].rows}</td>
              <td>{latestResult[1].cols}</td>
            </tr>
          )}
        </tbody>
      </table>

      {isReduced && gameResults.length > 0 && (
        <div className="paginationSB">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            &lt;
          </button>
          {[...Array(Math.ceil(gameResults.length / MAXBASE))].map(
            (value, index) => (
              <button
                key={`btnPage${index + 1}`}
                className={index + 1 == currentPage ? "currentPage" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ),
          )}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(Math.ceil(gameResults.length / MAXBASE), prev + 1),
              )
            }
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default Scoreboard;
