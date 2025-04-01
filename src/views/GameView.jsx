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
  const [isGameOver, setIsGameOver] = useState(false);

  const rollDice = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

  /**
     Handles effect for when a peg is selected.
     SIDE EFFECTS:
     - Removes the number for the given peg from availableNumbers
     - Resets state of availablePegs to initial state
     - Resets state of roll to initial state

     @param {Object} peg A peg object that is selected
   */
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

  /**
     Handles effect for when the mouse is hovered over a peg.
     SIDE EFFECTS:
     - Modifies available pegs to contain the modified hovered peg and its
     corresponding match, if any.  A match is the complement of the peg's number
     to the dice roll total.

     @param {Object} peg The peg that was hovered over.
  */
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

  /**
     Handles effect for when the mouse has left a peg.
     SIDE EFFECTS:
     - Modifies available pegs to contain the modified peg that was previously
     hovered over and its corresponding match, if any.  A match is the
     complement of the peg's number to the dice roll total.

     @param {Object} peg The peg that was left.
  */
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

  /**
     Creates a peg object for the given number and color.

     @param {Number} number A number to associate this peg with
     @param {String} color A string specifying a color for this peg.  The string
     can be a HEX code or CSS name for a string.
   */
  const generatePegChoice = useCallback((number, color) => {
    return {
      number: number,
      choiceColor: color,
      scale: '1',
    };
  }, []);

  /**
     Handles effect for when the roll button is pressed.
     SIDE EFFECTS:
     - Specifies dice roll
     - Specifies available pegs based on the dice roll performed
   */
  const handleRoll = () => {
    const firstDie = rollDice(1, 6);
    const secondDie = rollDice(1, 6);
    const total = firstDie + secondDie;
    const availablePairs = findAvailablePairs(total, availableNumbers);

    setRoll({
      first: firstDie,
      second: secondDie,
      total: total,
    });

    var colorIndices = generateRandomIndices(COLORS.length);

    const colorPair = (accumulator, pair) => {
      const color = COLORS[colorIndices.pop()];
      accumulator[pair[0]] = generatePegChoice(pair[0], color);
      if (pair[1]) accumulator[pair[1]] = generatePegChoice(pair[1], color);
      return accumulator;
    };
    const colorNumber = (accumulator, number) => {
      const color = COLORS[colorIndices.pop()];
      accumulator[number] = generatePegChoice(number, color);
      return accumulator;
    };

    if (availablePairs.size === 0) {
      const finalPegs = [...availableNumbers].reduce(colorNumber, {});

      setAvailablePegs(finalPegs);
      setIsGameOver(true);
    } else {
      const newAvailablePegs = [...availablePairs].reduce(colorPair, {});
      setAvailablePegs(newAvailablePegs);
    }
  };

  /**
     Handles effect for when the reset button is pressed.
     SIDE EFFECTS:
     - Resets ALL state variables to initial values
   */
  const handleReset = () => {
    setRoll(undefined);
    setAvailablePegs(undefined);
    setAvailableNumbers(new Set(INITIAL_NUMBERS));
    setIsGameOver(false);
  };

  /**
     Specifies the display for an available peg.
     SIDE-EFFECT:
     - If `isGameOver` is true: No mouse events are specified.  Mouse events are added, otherwise.

     @param {Object} peg An available peg object
     @param {Boolean} useMouseEvents True if mouse events should be added to this peg.  False otherwise.
     @returns A JSX element specifying the display of an available peg
   */
  const displayAvailablePeg = (peg) => (
    <span
      className="peg"
      style={{ backgroundColor: peg.choiceColor, transform: `${isGameOver ? 'none' : `scale(${peg.scale})`}` }}
      key={peg.number}
      onClick={() => isGameOver ? '' : handlePegSelect(peg)}
      onMouseEnter={() => isGameOver ? '' : handleOnMouseEnter(peg)}
      onMouseLeave={() => isGameOver ? '' : handleOnMouseLeave(peg)}
    >
      {peg.number}
    </span>
  );

  /**
     Specifies the display for an unavailable peg.

     @param {Number} number A number to associate with this peg
     @param {Function} opacityPredicate A function returning a boolean that specifies:
     - True: Make this peg opaque
     - False: Make this peg visible
     @returns A JSX element specifying the display of an unavailable peg
   */
  const displayUnavailablePeg = (number, opacityPredicate) => (
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
          {isGameOver && availablePegs ? (
            <>
              {Object.values(availablePegs).map((peg) => (displayAvailablePeg(peg)))}
              <span className="peg">{` : ${[...availableNumbers].reduce((accum, number) => accum + number, 0)}`}</span>
            </>
          ) : [...Array(9)].map((_, i) => {
            return availablePegs && availablePegs[i + 1] ?
              displayAvailablePeg(availablePegs[i + 1]) :
              displayUnavailablePeg(i + 1, (number) => !availableNumbers.has(number));
          })}
        </div>
        {!isGameOver && (
          <div className="selected-pegs-container">
            {availableNumbers.size < 9 && [...Array(9)].map((_, i) =>
            displayUnavailablePeg(i + 1, (number) => availableNumbers.has(number)))}
          </div>
        )}
        <div className="roll-container">
          {roll ? (
            <>
              <span key="die1" className={`die ${isGameOver && 'game-over-die'}`}>Die 1: {roll.first}</span>
              <span key="die2" className={`die ${isGameOver && 'game-over-die'}`}>Die 2: {roll.second}</span>
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
