import React from 'react';
import './App.css';
import GameView from './views/GameView';

const App = () => (
    <GameView />
);

export default App;

/* Chat GPT */
// import React, { useState } from "react";
// import "./App.css";

// // Helper function to roll two dice
// const rollDice = () => {
//   return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
// };

// const App = () => {
//   const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Numbers 1-9
//   const [dice, setDice] = useState([0, 0]); // Initial dice values
//   const [rolled, setRolled] = useState(false); // Check if dice have been rolled

//   // Function to handle dice roll
//   const handleRoll = () => {
//     const newDice = rollDice();
//     setDice(newDice);
//     setRolled(true);
//   };

//   // Function to mark a number as "shut"
//   const handleClick = (num) => {
//     setNumbers(numbers.filter((n) => n !== num)); // Remove clicked number
//   };

//   // Calculate the total sum of remaining numbers
//   const calculateSum = () => {
//     return numbers.reduce((total, num) => total + num, 0);
//   };

//   return (
//     <div className="App">
//       <h1>Shut the Box</h1>
//       <div className="dice">
//         <button onClick={handleRoll} disabled={rolled}>
//           Roll Dice
//         </button>
//         <p>
//           Dice: {dice[0]} + {dice[1]} = {dice[0] + dice[1]}
//         </p>
//       </div>

//       <div className="board">
//         {numbers.map((num) => (
//           <button
//             key={num}
//             className="number"
//             onClick={() => handleClick(num)}
//             disabled={rolled && num !== dice[0] && num !== dice[1]}
//           >
//             {num}
//           </button>
//         ))}
//       </div>

//       <div className="info">
//         {numbers.length === 0 ? (
//           <h2>You won! All numbers shut!</h2>
//         ) : (
//           <h2>Sum of remaining numbers: {calculateSum()}</h2>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;

