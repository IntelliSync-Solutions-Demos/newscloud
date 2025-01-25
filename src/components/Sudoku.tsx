import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Sudoku: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(null).map(() => Array(9).fill(0))
  );

  const renderSudokuGrid = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <input
            key={`${rowIndex}-${colIndex}`}
            type="number"
            min="1"
            max="9"
            className="w-10 h-10 text-center border border-gray-300 m-0.5"
            value={cell || ''}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              const newBoard = [...board];
              newBoard[rowIndex][colIndex] = newValue;
              setBoard(newBoard);
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sudoku Puzzle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {renderSudokuGrid()}
        </div>
      </CardContent>
    </Card>
  );
};
