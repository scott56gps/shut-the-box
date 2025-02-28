import React, { useCallback, useState } from 'react';

import findPairs from '../utils/findPairs';
import './GameView.css';

const initialPegs = [
  { isAvailable: true, choiceColor: 'none', number: 1, },
  { isAvailable: true, choiceColor: 'none', number: 2, },
  { isAvailable: true, choiceColor: 'none', number: 3, },
  { isAvailable: true, choiceColor: 'none', number: 4, },
  { isAvailable: true, choiceColor: 'none', number: 5, },
  { isAvailable: true, choiceColor: 'none', number: 6, },
  { isAvailable: true, choiceColor: 'none', number: 7, },
  { isAvailable: true, choiceColor: 'none', number: 8, },
  { isAvailable: true, choiceColor: 'none', number: 9, },
];

const GameView = () => {
  const [roll, setRoll] = useState(undefined);
  const [pegs, setPegs] = useState(initialPegs);
  const [colors, setColors] = useState(["#0020FF", "#FF009F", "#FFDF00", "#00FF60", "#00DFFF"]);

  const rollDice = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

  const generateColor = useCallback(() => {
    const randomIndex = rollDice(0, colors.length - 1);
    const generatedColor = colors[randomIndex];
    setColors(colors.filter((color) => color !== generatedColor));
    return generatedColor;
  }, [colors]);

  const handleRoll = useCallback(() => {
    const firstDie = rollDice(1, 6);
    const secondDie = rollDice(1, 6);
    const availablePairs = findPairs(firstDie + secondDie, pegs);

    setRoll({
      first: firstDie,
      second: secondDie,
      total: firstDie + secondDie,
    });

    // Modify the pegs to indicate the available choices
    var newPegs = [];
    var i = 0;
    var j = 8;
    while (i < j) {
      // If i is the key of an available pair
      if (availablePairs[i]) {
        // Generate a color
        const generatedColor = generateColor();

        // indicate a pair match IFF i != 0
        if (i !== 0) {
          newPegs.push({
            number: i,
            isAvailable: true,
            choiceColor: generatedColor,
          });
        }
        newPegs.push({
          number: availablePairs[i],
          isAvailable: true,
          choiceColor: generatedColor,
        });

        // Index j to its partner
        j = availablePairs[i] - 1;

        // Account for the only case in which there are no matching pairs, and
        //  only a single available peg
        if (i === 0 && j === 1) {
          newPegs.push(pegs[i]);
        }
      } else {
        if (i !== 0) {
          newPegs.push(pegs[i]);
        }
      }
      i = i + 1;
    }
    newPegs = newPegs.concat(pegs.slice(i + j));
    setPegs(newPegs.sort((peg1, peg2) => peg1.number > peg2.number));
  }, [pegs, generateColor]);

  const handleReset = useCallback(() => {
    setRoll(undefined);
    setPegs(initialPegs);
  }, []);

  return (
    <div className="App">
      <div className="game-board">
        <div className="pegs-container">
          {pegs.map((peg, i) => (
            <span
              className={`peg ${peg.isAvailable ? '' : 'selected'}`}
              style={{ backgroundColor: peg.choiceColor }}
              key={i}
            >
              {peg.number}
            </span>
          ))}
        </div>
        <div className="roll-container">
          {roll ? (
            <>
              <span key="die1" className="die">Die 1: {roll.first}</span>
              <span key="die2" className="die">Die 2: {roll.second}</span>
            </>
          ) : (
            <button type="button" onClick={handleRoll}>Roll!</button>
          )}
        </div>
        <button onClick={handleReset} type="button">Reset</button>
      </div>
    </div>
  );
};

export default GameView;
