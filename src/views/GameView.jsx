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
    if (roll && peg.choiceColor !== UNSET) {
      // We want the current peg to have margin
      peg.scale = `${MAGNIFIED_SCALE}`;

      // AND its match
      if (roll.total !== peg.number) {
        // There is a match to find
        const pegDifference = roll.total - peg.number - 1;
        const pegMatch = pegs[pegDifference];

        // If the numbers are 1 away from each other, make the space half as wide
        pegMatch.scale = `${MAGNIFIED_SCALE}`;

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


    // Modify the pegs to indicate the available choices
    // var newPegs = [];
    // var colorIndices = generateRandomIndices(COLORS.length);
    // var i = 0;
    // var j = 8;
    // while (i < j) {
    //   const upperMatch = availablePairs[i];
    //   // If i is the key of an available pair
    //   if (upperMatch) {
    //     // Generate a color
    //     const generatedColor = COLORS[colorIndices.pop()];

    //     // indicate a pair match IFF i != 0
    //     if (i !== 0) {
    //       newPegs.push(generatePegChoice(i, generatedColor));
    //     }
    //     newPegs.push(generatePegChoice(upperMatch, generatedColor));

    //     // Index j to its partner
    //     j = upperMatch - 1;
    //   } else {
    //     if (i !== 0) {
    //       newPegs.push(pegs[i-1]);
    //     }
    //   }
    //   i = i+1;
    // }

    // // If i and j are equal, put the "double" roll number (for example, 3+3 = 6) onto the new pegs
    // if (i === j) {
    //   newPegs.push(pegs[i-1]);
    // }

    // if (i+j !== 9) {
    //   // There are more numbers to be put on
    //   newPegs = newPegs.concat(pegs.slice(i + j));
    // }

    // setPegs(newPegs.sort((peg1, peg2) => peg1.number > peg2.number));
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
                  onMouseLeave={handleOnMouseLeave}
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
          {/* pegs.map((peg) => ( */
          /*   <span */
          /*     className="peg" */
          /*     style={{ backgroundColor: peg.choiceColor, opacity: peg.isAvailable ? '100%' : '0', transform: `scale(${peg.scale})` }} */
          /*     key={peg.number} */
          /*     onClick={() => handlePegSelect(peg)} */
          /*     onMouseEnter={() => handleOnMouseEnter(peg)} */
          /*     onMouseLeave={handleOnMouseLeave} */
          /*   > */
          /*     {peg.number} */
          /*   </span> */
          /* )) */}
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
