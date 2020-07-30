import React, {useState, useEffect} from 'react';
import Buttons from './Buttons';
import Cell from './Cell'

export default function GameOfLife(){
    // state for game vars
    const [game, setGame] = useState({
        generation: 0,
        interval: 3000,
        gridHeight: 1000,
        gridWidth: 1000,
        cellSize: 100,
        isRunning: false
      })
    const [cells, setCells] = useState([]);
    const [rows, setRows] = useState(game.gridHeight / game.cellSize)
    const [cols, setCols] = useState(game.gridWidth / game.cellSize)
    let intervalHandler = null;
    
    // create empty board
    const makeEmptyBoard = () => {
        let board = [];
        for (let y = 0 ; y < rows ; y++){
            board[y] = [];
            for (let x = 0 ; x < cols ; x++){
                board[y][x] = false;
            }
        }
        return board;
    }
    // state for board
    const [board, setBoard] = useState(makeEmptyBoard());
    const [boardRef, setBoardRef] = useState();
    
    // create cells from board state
    const makeCells = () => {
        let cells = [];
        for (let y = 0 ; y < rows ; y++){
            for (let x = 0 ; x < cols ; x++){
                if (board[y][x]){
                    cells.push({x,y})
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
        let time1 = Date.now();
        let newBoard = makeEmptyBoard();
        
        // iterate over all the cells
        for (let y = 0 ; y < rows ; y++){
            for (let x = 0 ; x < cols ; x++){
                // get the live neighbors for the cell
                let neighbors = calculateNeighbors(board, x, y)
                
                // if the cell was live
                if (board[y][x]){
                    // check if 2 or 3 neighbors are alive
                    if ( neighbors === 2 || neighbors === 3 ){
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    // if the cell was dead, check if exactly 3 live neighbors were there
                    if (neighbors === 3){
                        newBoard[y][x] = true;
                    }
                }
            }
        }
        setGame({
            ...game,
            generation: game.generation + 1
        })
        await setBoard(newBoard);
        setCells(makeCells());
        let time2 = Date.now()
        
    }
    // ***** Game Logic Functions End
    

    const runGame = () => {
        console.log('**** started running')
        setGame({
            ...game,
            isRunning: true
        })
        intervalHandler = window.setInterval(() => {
            runIteration();
        }, game.interval)
        // window.setTimeout(() => console.log('watch me!!!', game.isRunning), 1000);
        // window.setTimeout(() => {
        //     setTimeOutHandler(window.setInterval(() => {
        //         runIteration();
        //         // console.log('updating')
        //     }, game.interval));
        // }, 1000);
        
    }

    const stopGame = () => {
        console.log('**** STOP')
        setGame({
            ...game,
            isRunning: false
        })
        // if (intervalHandler){
            window.clearInterval(intervalHandler);
        // }
    }
    
    // handle Random fill
    const handleRandom = () => {
        let newBoard = makeEmptyBoard();
        for(let y = 0 ; y < rows ; y++){
            for (let x = 0 ; x < cols ; x++){
                newBoard[y][x] = (Math.random() >= 0.5);
            }
        }
        setGame({
            ...game,
            generation: 0
        })
        setBoard(newBoard);
        setCells(makeCells());
    }

    // handle Clear Board
    const handleClear = () => {
        setGame({
            ...game,
            generation: 0
        })
        setBoard(makeEmptyBoard());
        setCells(makeCells());
    }

    // !!!!! Experiment Starts Here
    // get element starting coordinates
    const getElementOffSet = () => {
        const rect = boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop
        };
    }

    const handleClick = async(e) => {
        const elemOffSet = getElementOffSet();

        // coordinates relative to the grid
        const offsetX = e.clientX - elemOffSet.x;
        const offsetY = e.clientY - elemOffSet.y;

        // coordinates in terms of cell
        const x = Math.floor(offsetX / game.cellSize);
        const y = Math.floor(offsetY / game.cellSize);
        // console.log('1', e.clientX, e.clientY, elemOffSet, offsetX, offsetY, x, y, board[y][x]);

        const newBoard = board;

        // change value of the cell
        if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
            newBoard[y][x] = !board[y][x];
        }
        // console.log('2', x, y);
        await setBoard(newBoard)
        setCells(makeCells())
        console.log(cells)
    }
    // !!!!!
    return (
        <div className='game'>
            <div className='game-of-life'>
                <div className='game-grid' 
                    style={{
                        width: game.gridWidth, 
                        height: game.gridHeight, 
                        backgroundSize: `${game.cellSize}px ${game.cellSize}px`}} 
                        ref = {(n) => setBoardRef(n)}
                        onClick={(e) => {if (!game.isRunning){handleClick(e)}}}
                        >
                        {cells.map(cell => (
                            <Cell x={cell.x} y={cell.y} cellSize={game.cellSize} 
                            key={`${cell.x}, ${cell.y}`} 
                            />
                        )
                        )}
                </div>

                <p className='generation-counter'>Generation: {game.generation}</p>
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