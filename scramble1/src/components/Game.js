import React, { useReducer } from 'react';
import Board from './Board';

const reducer = (state, action) => {
    switch (action.type) {
        case 'JUMP':
            return{
                ...state,
                xIsNext: action.payload.step % 2 === 0,
                history: state.history.slice(0, action.payload.step + 1),
            };
        case 'MOVE':
            return {
                ...state,    // keep previous state ?
                history: state.history.concat({
                    squares: action.payload.squares,
                }),
                xIsNext: !state.xIsNext,
            };
        default:
            return state;
    };
}

export default function Game() {
    const [state, dispatch] = useReducer(reducer, {
        xIsNext: true,
        history: [{ squares: Array(9).fill(null) }],
    });

    const { xIsNext, history } = state;

    const jumpTo = (step) => {
        dispatch({
            type: 'JUMP',
            payload: { step}
        });
    }

    const handleClick = (i) => {
        const current = history[history.length - 1];
        // create a copy of squares
        const squares = current.squares.slice();
        // squares is an element in the history object and is an arrat of 9
        // .slice copies an array, if no paraemeters it copies the lot
     
        const winner = calculateWinner(squares);
        console.log('here',winner);

        if (winner || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        dispatch({ type: 'MOVE', payload: { squares } });
    };

    // current score
    console.log('there');
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const status = winner 
        ? winner === 'D' 
            ? 'Draw' 
            : 'And.....the glorious winner is' + winner
        : 'Next player is ' + (xIsNext ? 'X' : 'O');

    
    const moves = history.map( (step, move) => {
        const desc = move ?'Go to #' + move : 'Start the game';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });
    
    return (
        <div className={winner? 'game disabled' :"game"}>
            <div className="game-board">
                <Board onClick={(i) => handleClick(i)} squares={current.squares}></Board>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ul>{moves}</ul>
            </div>
        </div>
    );
}

const calculateWinner = (squares) => {
    const winnerLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    let isDraw = true;

    for (let i = 0; i < winnerLines.length; i++) {
        const [a, b, c] = winnerLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return squares[a];
        }
        if (!squares[a] || !squares[b] || !squares[c]) {
            isDraw = false;
        }
    }
    if (isDraw) return 'D';
    return null;
}

