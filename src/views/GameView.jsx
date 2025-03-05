import React, { useCallback, useState } from 'react';

import findPairs from '../utils/findPairs';
import './GameView.css';

const initialPegs = [
  { isAvailable: true, choiceColor: 'none', number: 1, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 2, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 3, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 4, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 5, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 6, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 7, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 8, scale: '1' },
  { isAvailable: true, choiceColor: 'none', number: 9, scale: '1' },
];

const scaleFactor = 1.3;

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

  const handlePegSelect = (peg) => {
    if (roll && peg.choiceColor !== 'none') {
      peg.isAvailable = false;

      if (roll.total !== peg.number) {
        // There is a match to find
        const pegDifference = roll.total - peg.number - 1;
        const pegMatch = pegs[pegDifference];

        // If the numbers are 1 away from each other, make the space half as wide
        pegMatch.isAvailable = false;

        setPegs(pegs.map((statePeg) => statePeg.number === peg.number ? peg :
          statePeg.number === pegMatch.number ? pegMatch : statePeg));
      } else {
        setPegs(pegs.map((statePeg) => statePeg.number === peg.number ? peg : statePeg));
      }
    }
  }

  const handleOnMouseEnter = (peg) => {
    if (roll && peg.choiceColor !== 'none') {
      // We want the current peg to have margin
      peg.scale = `${scaleFactor}`;

      // AND its match
      if (roll.total !== peg.number) {
        // There is a match to find
        const pegDifference = roll.total - peg.number - 1;
        const pegMatch = pegs[pegDifference];

        // If the numbers are 1 away from each other, make the space half as wide
        pegMatch.scale = `${scaleFactor}`;

        setPegs(pegs.map((statePeg) => statePeg.number === peg.number ? peg :
                         statePeg.number === pegMatch.number ? pegMatch : statePeg));
      } else {
        setPegs(pegs.map((statePeg) => statePeg.number === peg.number ? peg : statePeg));
      }
    }
  };

  const handleOnMouseLeave = () => {
    if (pegs) {
      setPegs(pegs.map((peg) => {
        peg.scale = '1';
        return peg;
      }))
    }
  };

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
    while (i <= j) {
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
          newPegs.push(pegs[i-1]);
        }
      }
      i = i + 1;
    }

    // If i is 5, then that means that we are missing the last index of the
    //  original pegs array: index 8
    newPegs = newPegs.concat(pegs.slice(i === 5 && j === 4 ? 8 : i + j));
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
              className="peg"
              style={{ backgroundColor: peg.choiceColor, opacity: peg.isAvailable ? '100%' : '0', transform: `scale(${peg.scale})` }}
              key={i}
              onClick={() => handlePegSelect(peg)}
              onMouseEnter={() => handleOnMouseEnter(peg)}
              onMouseLeave={handleOnMouseLeave}
            >
              {peg.number}
            </span>
          ))}
        </div>
        <div className="selected-pegs-container">
          {pegs.map((peg) => (
            <span
              className="peg"
              style={{ opacity: peg.isAvailable ? '0' : '100%' }}
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
