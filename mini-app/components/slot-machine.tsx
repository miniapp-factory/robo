"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

export function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [spinning, setSpinning] = useState(false);

  // initialize grid
  useEffect(() => {
    const initGrid = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => fruits[Math.floor(Math.random() * fruits.length)])
    );
    setGrid(initGrid);
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col) => {
          const newCol = [...col];
          newCol.pop(); // remove bottom
          newCol.unshift(fruits[Math.floor(Math.random() * fruits.length)]); // add new top
          return newCol;
        });
        return newGrid;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  // win condition inline
  const win =
    // rows
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
    (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
    (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
    // columns
    (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
    (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <img
              key={`${colIdx}-${rowIdx}`}
              src={fruitImages[fruit]}
              alt={fruit}
              width={64}
              height={64}
            />
          ))
        )}
      </div>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
        onClick={spin}
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <p className="text-green-800 font-semibold">You win!</p>
          <Share text={`I just hit a win on the slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
