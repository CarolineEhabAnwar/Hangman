import { useState, useEffect, useCallback } from "react";
import words from "./assets/wordList.json";
import HangmanDrawing from "./containers/HangmanDrawing/HangmanDrawing";
import HangmanWord from "./containers/HangmanWord/HangmanWord";
import Keyboard from "./containers/Keyboard/Keyboard";

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words?.length)];
  });

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters?.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters?.length >= 6;
  const isWinner = wordToGuess
    ?.split("")
    ?.every((letter) => guessedLetters?.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters?.includes(letter) || isWinner || isLoser) {
        return;
      }
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e?.key;
      if (!key?.match(/^[a-z]$/)) {
        return;
      }
      e?.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refrech to try again"}
        {isLoser && "Nice Try! - Refrech to try again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters?.length} />
      <HangmanWord
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
        reveal={isLoser}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters?.filter((letter) =>
            wordToGuess?.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
