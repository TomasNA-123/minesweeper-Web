import "./mineGrid.css";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function itsAMine(mines: number[][], cords: number[]) {
  return mines.some(([a, b]) => a === cords[0] && b === cords[1]);
}

function MineGrid() {
  let rows = 15;
  let columns = 15;

  let mines = 20;
  let minesCords: number[][] = [];

  let minesList = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => 0),
  );

  while (minesCords.length < mines) {
    let cords = [randomInt(0, rows - 1), randomInt(0, columns - 1)];
    if (!itsAMine(minesCords, cords)) {
      minesCords.push(cords);
    }
  }

  minesCords.map((cord) => (minesList[cord[0]][cord[1]] = -1));

  minesCords.map((cord) => {
    for (
      let i = Math.max(cord[0] - 1, 0);
      i <= Math.min(cord[0] + 1, rows - 1);
      i++
    ) {
      for (
        let j = Math.max(cord[1] - 1, 0);
        j <= Math.min(cord[1] + 1, columns - 1);
        j++
      ) {
        console.log(`${i}-${j}`);
        if (minesList[i][j] != -1) {
          minesList[i][j] += 1;
        }
      }
    }
  });

  return (
    <div className="grid">
      {minesList.map((rowItem, rowIndex) =>
        rowItem.map((colItem, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${itsAMine(minesCords, [rowIndex, colIndex]) ? "mine" : ""}`}
          >
            {colItem}
          </div>
        )),
      )}
    </div>
  );
}

export default MineGrid;
