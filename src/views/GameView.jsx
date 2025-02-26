import React, { useCallback, useEffect, useState } from 'react';

import findPairs from '../utils/findPairs';
import './GameView.css';

const GameView = () => {
    const [roll, setRoll] = useState(undefined);
    const [pegs, setPegs] = useState([
      { isAvailable: true, choiceColor: 'none', number: 1, },
      { isAvailable: true, choiceColor: 'none', number: 2, },
      { isAvailable: true, choiceColor: 'none', number: 3, },
      { isAvailable: true, choiceColor: 'none', number: 4, },
      { isAvailable: true, choiceColor: 'none', number: 5, },
      { isAvailable: true, choiceColor: 'none', number: 6, },
      { isAvailable: true, choiceColor: 'none', number: 7, },
      { isAvailable: true, choiceColor: 'none', number: 8, },
      { isAvailable: true, choiceColor: 'none', number: 9, },
    ]);
    const [colors, setColors] = useState(["#007BA7", "#FF6F61", "#FFF200", "#50C878", "#E6A8D7", "#FF6A13", "#708090", "#87CEEB", "#8E4585"]);

    const rollDice = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

    const generateColor = useCallback(() => {
        const randomIndex = rollDice(0, colors.length-1);
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
        } else {
          if (i !== 0) {
            newPegs.push(pegs[i]);
          }
        }
        i = i+1;
      }
      newPegs = newPegs.concat(pegs.slice(i + j));
      setPegs(newPegs.sort((peg1, peg2) => peg1.number > peg2.number));
    }, [pegs, generateColor]);

  const handleReset = () => setRoll(undefined);

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
            {/* <div className="available-moves"> */}
            {/*   {roll && availableMoves.map((move) => ( */}
            {/*       <span key={move.first}>{move.first === 0 ? `${move.second} ` : `${move.first}:${move.second} `}</span> */}
            {/*   ))} */}
            {/* </div> */}
          </div>
        </div>
    );
};

export default GameView;
