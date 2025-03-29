import React, { useCallback, useState } from 'react';

import generateRandomIndices from '../utils/generateRandomIndices';
import './GameView.css';

const findAvailablePairs = require('../utils/findAvailablePairs');

const UNSET = 'unset';
const INITIAL_SCALE = '1';
const COLORS = ["#0020FF", "#FF009F", "#FFDF00", "#00FF60", "#00DFFF"];
const MAGNIFIED_SCALE = 1.3;
const INITIAL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const GameView = () => {
  const [roll, setRoll] = useState(undefined);
  const [availablePegs, setAvailablePegs] = useState(undefined);
  const [availableNumbers, setAvailableNumbers] = useState(new Set(INITIAL_NUMBERS));

  const rollDice = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

  const handlePegSelect = (peg) => {
    if (peg.number !== roll.total) {
      // There is a match to find
      const matchKey = roll.total - peg.number;
      const pegMatch = availablePegs[matchKey];

      setAvailableNumbers(new Set([...availableNumbers].filter((number) =>
        number !== peg.number && number !== pegMatch.number)));
    } else {
      setAvailableNumbers(new Set([...availableNumbers].filter((number) =>
        number !== peg.number)));
    }
    setAvailablePegs(undefined);
    setRoll(undefined);
  }

  const handleOnMouseEnter = (peg) => {
    // We want the current peg to be scaled
    peg.scale = `${MAGNIFIED_SCALE}`;

    // AND its match
    if (peg.number !== roll.total) {
      const matchKey = roll.total - peg.number;
      const pegMatch = availablePegs[matchKey];
      pegMatch.scale = `${MAGNIFIED_SCALE}`;

      setAvailablePegs({
        ...availablePegs,
        [peg.number]: peg,
        [matchKey]: pegMatch,
      });
    } else {
      setAvailablePegs({
        ...availablePegs,
        [peg.number]: peg,
      });
    }
  };

  const handleOnMouseLeave = (peg) => {
    peg.scale = INITIAL_SCALE;

    if (peg.number !== roll.total) {
      const matchKey = roll.total - peg.number;
      const pegMatch = availablePegs[matchKey];
      pegMatch.scale = INITIAL_SCALE;

      setAvailablePegs({
        ...availablePegs,
        [peg.number]: peg,
        [matchKey]: pegMatch,
      });
    } else {
      setAvailablePegs({
        ...availablePegs,
        [peg.number]: peg,
      });
    }
  };

  const generatePegChoice = useCallback((number, color) => {
    return {
      number: number,
      choiceColor: color,
      scale: '1',
    };
  }, []);

  const handleRoll = () => {
    const firstDie = rollDice(1, 6);
    const secondDie = rollDice(1, 6);
    const total = firstDie + secondDie;
    const availablePairs = findAvailablePairs(total, availableNumbers);

    var colorIndices = generateRandomIndices(COLORS.length);

    const newAvailablePegs = [...availablePairs].reduce((accumulator, pair) => {
      const color = COLORS[colorIndices.pop()];
      accumulator[pair[0]] = generatePegChoice(pair[0], color);
      if (pair[1]) accumulator[pair[1]] = generatePegChoice(pair[1], color);
      return accumulator;
    }, {});

    setRoll({
      first: firstDie,
      second: secondDie,
      total: total,
    });
    setAvailablePegs(newAvailablePegs);
  };

  const handleReset = () => {
    setRoll(undefined);
    setAvailablePegs(undefined);
    setAvailableNumbers(new Set(INITIAL_NUMBERS));
  };

  const displayAvailablePeg = (peg) => (
    <span
      className="peg"
      style={{ backgroundColor: peg.choiceColor, transform: `scale(${peg.scale})` }}
      key={peg.number}
      onClick={() => handlePegSelect(peg)}
      onMouseEnter={() => handleOnMouseEnter(peg)}
      onMouseLeave={() => handleOnMouseLeave(peg)}
    >
      {peg.number}
    </span>
  );

  const displayNonAvailablePeg = (number, opacityPredicate) => (
    <span
      className="peg"
      style={{ backgroundColor: UNSET, opacity: opacityPredicate(number) ? '0' : '100%' }}
      key={number}
    >
      {number}
    </span>
  );

  return (
    <div className="App">
      <div className="game-board">
        <div className="pegs-container">
          {[...Array(9)].map((_, i) => {
            const availablePeg = availablePegs ? availablePegs[i+1] : undefined;

            if (availablePeg) {
              return displayAvailablePeg(availablePeg);
            } else {
              return displayNonAvailablePeg(i+1, (number) => !availableNumbers.has(number))
            }
          })}
        </div>
        <div className="selected-pegs-container">
          {availableNumbers.size < 9 && [...Array(9)].map((_, i) =>
            displayNonAvailablePeg(i+1, (number) => availableNumbers.has(number)))}
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
