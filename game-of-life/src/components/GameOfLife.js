import React, {useState} from 'react';
import Buttons from './Buttons';
import Cell from './Cell'

export default function GameOfLife(){
    // state for game vars
    const [game, setGame] = useState({
        generations: 0,
        interval: 3000,
        gridHeight: 1000,
        gridWidth: 1000,
        cellSize: 100,
        isRunning: false
      })
    const [cells, setCells] = useState([]);
    const [rows, setRows] = useState(game.gridHeight / game.cellSize)
    const [cols, setCols] = useState(game.gridWidth / game.cellSize)
    const [timeOutHandler, setTimeOutHandler] = useState(null);
    
    // create empty board
    const makeEmptyBoard = () => {
        let board = [];
        for (let i = 0 ; i < rows ; i++){
            board[i] = [];
            for (let j = 0 ; j < cols ; j++){
                board[i][j] = false;
            }
        }
        return board;
    }
    // state for board
    const [board, setBoard] = useState(makeEmptyBoard());
    
    // create cells from board state
    const makeCells = () => {
        let cells = [];
        for (let i = 0 ; i < rows ; i++){
            for (let j = 0 ; j < cols ; j++){
                if (board[i][j]){
                    cells.push({i,j})
                }
            }
        }
        return cells;
    }
    
    // button controllers
    const makeFaster = (e) => {
        e.preventDefault();
        setGame({
            ...game,
            interval: 0.5 * game.interval
        });
    }

    const makeSlower = (e) => {
        e.preventDefault();
        setGame({
            ...game,
            interval: 2 * game.interval
        })
    }

    // ***** Game Logic Functions
    // calculate live neighbors - O(1) complexity
    const calculateNeighbors = (board, x, y) => {
        let neighors = 0;
        const dirs = [[-1,-1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]

        for (let i = 0 ; i < dirs.length ; i++){
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if( x1 >= 0 && x1 < cols && y1 >= 0 && y1 < rows && board[y1][x1]){
                neighors ++;
            }
        }

        return neighors
    }

    // run iteration
    const runIteration = async() => {
        console.log('running iteration');
        let newBoard = makeEmptyBoard();
        
        // iterate over all the cells
        for (let i = 0 ; i < rows ; i++){
            for (let j = 0 ; j < cols ; j++){
                // get the live neighbors for the cell
                let neighbors = calculateNeighbors(board, i, j)
                
                // if the cell was live
                if (board[i][j]){
                    // check if 2 or 3 neighbors are alive
                    if ( neighbors === 2 || neighbors === 3 ){
                        newBoard[i][j] = true;
                    } else {
                        newBoard[i][j] = false;
                    }
                } else {
                    // if the cell was dead, check if exactly 3 live neighbors were there
                    if ( !board[i][j] && neighbors === 3){
                        newBoard[i][j] = true;
                    }
                }
            }
        }

        await setBoard(newBoard);
        console.log('set new board');
        await setCells(makeCells());
        console.log('set new cells');
        // setTimeOutHandler(window.setTimeout(() => {
        //     runIteration();
        // }, game.interval));
    }
    // ***** Game Logic Functions End
    

    const runGame = () => {
        setGame({
            ...game,
            isRunning: true
        })
        runIteration();
        setTimeOutHandler(window.setTimeout(() => {
            runIteration();
        }, game.interval));
    }

    const stopGame = () => {
        console.log('**** STOP')
        setGame({
            ...game,
            isRunning: false
        })
        if (timeOutHandler){
            window.clearTimeout(timeOutHandler);
            setTimeOutHandler(null);
        }
    }
    
    // handle Random fill
    const handleRandom = () => {
        let newBoard = makeEmptyBoard();
        for(let i = 0 ; i < rows ; i++){
            for (let j = 0 ; j < cols ; j++){
                newBoard[i][j] = (Math.random() >= 0.5);
            }
        }

        setBoard(newBoard);
        setCells(makeCells());
    }

    // handle Clear Board
    const handleClear = () => {
        setBoard(makeEmptyBoard());
        setCells(makeCells());
    }

    // !!!!! Experiment Starts Here
    return (
        <div className='game'>
            <div className='game-of-life'>
                <div className='game-grid' 
                    style={{
                        width: game.gridWidth, 
                        height: game.gridHeight, 
                        backgroundSize: `${game.cellSize}px ${game.cellSize}px`}} 
                        >
                        {cells.map(cell => (
                            <Cell i={cell.i} j={cell.j} cellSize={game.cellSize} key={`${cell.i}, ${cell.j}`} />
                        )
                        )}
                </div>
            </div>
            <Buttons 
                makeFaster={makeFaster} 
                makeSlower={makeSlower} 
                runGame={runGame} 
                stopGame={stopGame} 
                handleClear = {handleClear}
                handleRandom = {handleRandom}
                runIteration = {runIteration}
            />
        </div>
        
    )
}