import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export const Wordle: React.FC = () => {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  useEffect(() => {
    // In a real implementation, fetch a random word from a dictionary
    const words = ['apple', 'beach', 'chair', 'dance', 'eagle'];
    setTargetWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  const handleGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }

    setCurrentGuess('');
  };

  const getLetterColor = (guess: string, index: number) => {
    if (guess[index] === targetWord[index]) return 'bg-green-500';
    if (targetWord.includes(guess[index])) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <ScrollArea className="h-full w-full">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Wordle Game</CardTitle>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent>
          <div className="space-y-4">
            {guesses.map((guess, idx) => (
              <React.Fragment key={idx}>
                <div className="flex space-x-2">
                  {guess.split('').map((letter, letterIdx) => (
                    <div
                      key={letterIdx}
                      className={`w-10 h-10 flex items-center justify-center text-white font-bold ${getLetterColor(guess, letterIdx)}`}
                    >
                      {letter.toUpperCase()}
                    </div>
                  ))}
                </div>
                {idx < guesses.length - 1 && <Separator className="my-2" />}
              </React.Fragment>
            ))}

            {gameStatus === 'playing' && (
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={currentGuess}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    if (value.length <= WORD_LENGTH) setCurrentGuess(value);
                  }}
                  maxLength={WORD_LENGTH}
                  placeholder={`Enter a ${WORD_LENGTH}-letter word`}
                  className="flex-grow"
                />
                <Button onClick={handleGuess} disabled={currentGuess.length !== WORD_LENGTH}>
                  Guess
                </Button>
              </div>
            )}

            {gameStatus === 'won' && (
              <div className="text-green-600 font-bold">Congratulations! You won!</div>
            )}
            {gameStatus === 'lost' && (
              <div className="text-red-600 font-bold">
                Game over! The word was {targetWord.toUpperCase()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};
