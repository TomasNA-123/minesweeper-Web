import { useEffect, useState, useRef } from "react";
import "./scoreboard.css";
import "./button";
import Button from "./button";

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
  globalDifficulty: string;
  importOption: string;
  setGameResults: (value: gameResult[]) => void;
  openImportModal: () => void;
  resetImportOption: () => void;
}

function Scoreboard(props: Props) {
  const {
    gameResults,
    isReduced,
    globalDifficulty,
    importOption,
    setGameResults,
    openImportModal,
    resetImportOption,
  } = props;

  const MAXBASE = 5;
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(MAXBASE);

  // template of an empty game result
  const LATESTRESULTBASE: [number, gameResult] = [
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
  ];

  const [latestResult, setLatestResult] =
    useState<[number, gameResult]>(LATESTRESULTBASE);

  const [localGameResults, setLocalGameResults] =
    useState<gameResult[]>(gameResults);

  const [currentPage, setCurrentPage] = useState(1);
  const [difficultyChoice, setDifficultyChoice] = useState("Medium");

  const [difficultyResults, setDifficultyResults] = useState(0);

  const [importedData, setImpotedData] = useState([] as gameResult[]);

  // update the SB content
  const updateScoreboard = () => {
    if (gameResults.length == 0) return false;

    let localResults = [...gameResults];

    localResults.sort((a, b) => a.time - b.time);

    if (difficultyChoice != "All") {
      localResults = localResults.filter(
        (obj) => obj.difficulty == difficultyChoice,
      );
    }

    if (localResults.length != 0) {
      let auxLatestResult = localResults.reduce((last, obj) => {
        return obj.id > last.id ? obj : last;
      });

      let positionLatestResult = localResults.findIndex(
        (item) => item.id == auxLatestResult.id,
      );

      setLatestResult([positionLatestResult, auxLatestResult]);
    }

    if (isReduced && localResults.length > 0) {
      localResults = localResults.slice(
        minRange,
        Math.min(localResults.length, maxRange),
      );
    }

    setLocalGameResults(localResults);
  };

  // count the difficulty results
  const countResults = () => {
    let cResults = gameResults.length;

    if (difficultyChoice != "All") {
      cResults = gameResults.filter(
        (item) => item.difficulty == difficultyChoice,
      ).length;
    }

    setDifficultyResults(cResults);
  };

  // update sb at startup
  useEffect(() => {
    updateScoreboard();
    countResults();
  }, []);

  // change the sb page
  const updateRange = (page: number) => {
    const newMaxRange = MAXBASE * page;

    setMinRange(Math.max(0, newMaxRange - MAXBASE));
    setMaxRange(newMaxRange);
  };

  useEffect(() => {
    updateScoreboard();
    countResults();
  }, [difficultyChoice, gameResults, minRange, maxRange]);

  useEffect(() => {
    updateRange(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setDifficultyChoice(globalDifficulty);
  }, [globalDifficulty]);

  // reset the page to 1 on change the difficulty page
  useEffect(() => {
    setCurrentPage(1);
    countResults();
  }, [difficultyChoice]);

  // Export game results
  const exportResults = () => {
    const blob = new Blob([JSON.stringify(gameResults)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "minesweeper_results.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  // import game results
  const importRef = useRef<HTMLInputElement | null>(null);

  const handleClickImport = () => {
    importRef.current?.click();
  };

  // Read the document in the hidden input
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const importedResults = event.target?.result as string;
      try {
        const importedResultsObj = JSON.parse(importedResults) as gameResult[];

        if (gameResults.length > 0) {
          setImpotedData(importedResultsObj);
          openImportModal();
        } else {
          setGameResults(importedResultsObj);
        }
      } catch {
        alert("formato no valido");
      }
    };

    reader.readAsText(file);
  };

  // Import the data when the option is selected
  useEffect(() => {
    if (importOption != "") {
      let newResults = gameResults;

      // Merge the new data with the current results
      if (importOption == "merge") {
        const newImportedDataID = importedData.map((item) => ({
          ...item,
          id: item.id + gameResults.length,
        }));
        newResults = [...gameResults, ...newImportedDataID] as gameResult[];
      }

      // Replace all the results
      if (importOption == "replace") {
        newResults = importedData;
      }

      resetImportOption();
      setGameResults(newResults);
    }
  }, [importOption]);

  return (
    <div className="scoreboard">
      <div className="difficultyChoice">
        <Button
          typeButton="primary"
          content="Easy"
          click={() => setDifficultyChoice("Easy")}
          choiced={difficultyChoice == "Easy"}
        ></Button>
        <Button
          typeButton="primary"
          content="Medium"
          click={() => setDifficultyChoice("Medium")}
          choiced={difficultyChoice == "Medium"}
        ></Button>
        <Button
          typeButton="primary"
          content="Hard"
          click={() => setDifficultyChoice("Hard")}
          choiced={difficultyChoice == "Hard"}
        ></Button>
        <Button
          typeButton="primary"
          content="Custom"
          click={() => setDifficultyChoice("Custom")}
          choiced={difficultyChoice == "Custom"}
        ></Button>
        <Button
          typeButton="primary"
          content="All"
          click={() => setDifficultyChoice("All")}
          choiced={difficultyChoice == "All"}
        ></Button>
      </div>

      <div className="sbTableContainer">
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

            {isReduced &&
              latestResult[0] >= maxRange &&
              (latestResult[1].difficulty == difficultyChoice ||
                difficultyChoice == "All") && (
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
      </div>

      {isReduced && difficultyResults > 0 && (
        <div className="paginationSB">
          <Button
            typeButton="primary"
            content="<"
            className="paginationBtn"
            click={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          ></Button>
          {[...Array(Math.ceil(difficultyResults / MAXBASE))].map(
            (value, index) => (
              <Button
                key={`btnPage${index + 1}`}
                typeButton="primary"
                content={String(index + 1)}
                className="paginationBtn"
                choiced={index + 1 == currentPage}
                click={() => setCurrentPage(index + 1)}
              ></Button>
            ),
          )}
          <Button
            typeButton="primary"
            content=">"
            className="paginationBtn"
            click={() =>
              setCurrentPage((prev) =>
                Math.min(Math.ceil(difficultyResults / MAXBASE), prev + 1),
              )
            }
          ></Button>
        </div>
      )}

      <input
        type="file"
        accept=".txt"
        ref={importRef}
        onChange={handleFileImport}
        style={{ display: "none" }}
      />
      <div className="bottomButtons">
        <Button
          typeButton="primary"
          content="Import Results"
          click={handleClickImport}
        ></Button>
        <Button
          typeButton="success"
          content="Export Results"
          click={() => exportResults()}
        ></Button>
      </div>
    </div>
  );
}

export default Scoreboard;
