import React, { useCallback, useState } from 'react';

import './GameView.css';
const findAvailablePairs = require('../utils/findAvailablePairs');

const UNSET = 'unset';
const INITIAL_SCALE = '1';
const COLORS = ["#0020FF", "#FF009F", "#FFDF00", "#00FF60", "#00DFFF"];
const MAGNIFIED_SCALE = 1.3;

const initialPegs = [
  { isAvailable: true, choiceColor: UNSET, number: 1, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 2, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 3, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 4, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 5, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 6, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 7, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 8, scale: INITIAL_SCALE },
  { isAvailable: true, choiceColor: UNSET, number: 9, scale: INITIAL_SCALE },
];

const GameView = () => {
  const [roll, setRoll] = useState(undefined);
  const [pegs, setPegs] = useState(initialPegs);
  const [availablePegs, setAvailablePegs] = useState(undefined);
  const [chosenNumbers, setChosenNumbers] = useState(undefined);
  const [availableNumbers, setAvailableNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const rollDice = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

  /**
     Generates a random list of indices from 0 to n.
   */
  const generateRandomIndices = (n) => {
    var arr = [];
    while (arr.length < n) {
      var r = Math.floor(Math.random() * n)
      if (arr.indexOf(r) === -1) {
        arr.push(r)
      }
    }
    return arr;
  };

  const handlePegSelect = (peg) => {
    if (roll && peg.choiceColor !== 'none') {
      peg.isAvailable = false;

      if (roll.total !== peg.number) {
        // There is a match to find
        const pegDifference = roll.total - peg.number - 1;
        const pegMatch = pegs[pegDifference];

        pegMatch.isAvailable = false;

        setPegs(pegs.map((statePeg) => {
          return statePeg.number === peg.number ? peg :
            statePeg.number === pegMatch.number ? pegMatch : { ...statePeg, choiceColor: UNSET }
        }));
      } else {
        setPegs(pegs.map((statePeg) => statePeg.number === peg.number ? peg : { ...statePeg, choiceColor: UNSET }));
      }
      setRoll(undefined);
    }
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
    setPegs(initialPegs);
  };

  return (
    <div className="App">
      <div className="game-board">
        <div className="pegs-container">
          {[...Array(9)].map((_, i) => {
            const availablePeg = availablePegs ? availablePegs[i+1] : undefined;

            if (availablePeg) {
              return (
                <span
                  className="peg"
                  style={{ backgroundColor: availablePeg.choiceColor, transform: `scale(${availablePeg.scale})` }}
                  key={availablePeg.number}
                  onClick={() => handlePegSelect(availablePeg)}
                  onMouseEnter={() => handleOnMouseEnter(availablePeg)}
                  onMouseLeave={() => handleOnMouseLeave(availablePeg)}
                >
                  {availablePeg.number}
                </span>
              );
            } else {
              return (
                <span
                  className="peg"
                  style={{ backgroundColor: UNSET, opacity: chosenNumbers && chosenNumbers.has(i+1) ? '0' : '100%' }}
                  key={i+1}
                >
                  {i+1}
                </span>
              )
            }
          })}
        </div>
        {/* <div className="selected-pegs-container"> */}
        {/*   {pegs.map((peg) => ( */}
        {/*     <span */}
        {/*       className="peg" */}
        {/*       key={peg.number} */}
        {/*       style={{ opacity: peg.isAvailable ? '0' : '100%' }} */}
        {/*     > */}
        {/*       {peg.number} */}
        {/*     </span> */}
        {/*   ))} */}
        {/* </div> */}
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
