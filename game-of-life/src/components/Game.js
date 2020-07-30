import React, {useState, useEffect} from 'react';
import Buttons from './Buttons'
import Cell from './Cell'

export default function Game(){
    // state variable for game board
    const [grid, setGrid] = useState({
        height: 1000,
        width: 1000,
        cellSize: 100,
        rows: 10,
        cols: 10
    })

    // state variable for game
    const [game, setGame] = useState({
        generation: 0,
        interval: 1000,
        isRunning: false
    })

    // make empty board
    const makeEmptyBoard = () => {
        let board = [];
        for (let y = 0; y < grid.rows; y++) {
            board[y] = [];
            for (let x = 0; x < grid.cols; x++) {
                board[y][x] = false;
            }
        }

        return board;
    }

    // variable for board
    const [board, setBoard] = useState(makeEmptyBoard());
    const [boardRef, setBoardRef] = useState(null);
    
    // make cells out of board
    const makeCells = () => {
        let cells = []
        for (let y = 0; y < grid.rows; y++){
            for (let x = 0; x < grid.cols; x++){
                if (board[y][x]) {
                    cells.push({ x , y})
                }
            }
        }
        
        return cells;
    }
    // state variable for cells
    const [cells, setCells] = useState(makeCells());
    // state variable for interval
    const [intervalHandler, setIntervalHandler] = useState(null);

    // get game grid offset
    const getElementOffset = () => {
        const rect = boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }

    // click button for cells
    const handleClick = (e) => {

        const elemOffset = getElementOffset();
        const offsetX = e.clientX - elemOffset.x;
        const offsetY = e.clientY - elemOffset.y;
        
        const x = Math.floor(offsetX / grid.cellSize);
        const y = Math.floor(offsetY / grid.cellSize);
        console.log('cicked', x, y);

        let newBoard = board;

        if (x >= 0 && x <= grid.cols && y >= 0 && y <= grid.rows) {
            newBoard[y][x] = !board[y][x];
        }

        setBoard(newBoard);
        setCells(makeCells());
        
    }

    // Game Logic Functions

    // count live neighbors
    const calculateNeighbors = (board, x, y) => {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < grid.cols && y1 >= 0 && y1 < grid.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    // run the iterations
    const runIteration = () => {
        setGame({
            ...game,
            generation: game.generation + 1
        });

        let newBoard = makeEmptyBoard();

        for (let y = 0; y < grid.rows; y++) {
            for (let x = 0; x < grid.cols; x++) {
                let neighbors = calculateNeighbors(board, x, y);
                if (board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        setBoard(newBoard);
        setCells(makeCells());

        
    }

    // run game
    const handleRun = () => {
        setGame({
            ...game,
            isRunning: true
        });
        // runIteration();
        // setIntervalHandler(window.setInterval(() => {
        //     // console.log('updating')
        //     runIteration();
        // }, game.interval));
        let count = 1
        window.setInterval(() => {
            console.log('hello', count);
            count ++
        }, 1000)
    }

    // stop game
    const handleStop = () => {
        setGame({
            ...game,
            isRunning: false
        });
        if(intervalHandler) {
            window.clearInterval(intervalHandler);
            setIntervalHandler(null)
        }
    }
   
    // handle interval change
    const makeFaster = () => {
        setGame({
            ...game,
            interval: 0.5 * game.interval
        })
    } 

    const makeSlower = () => {
        setGame({
            ...game,
            interval: 2 * game.interval
        })
    }

    // handle random filling in grid
    const handleRandom = () => {
        setGame({
            ...game,
            generation: 0
        });

        let newBoard = makeEmptyBoard();
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                newBoard[y][x] = (Math.random() >= 0.5);
            }
        }
        setBoard(newBoard);
        setCells(makeCells());
    }

    // handle clear filling in grid
    const handleClear = () => {
        setGame({
            ...game,
            generation: 0
        });
        setBoard(makeEmptyBoard());
        setCells(makeCells());
    }

    // handle custom grid size
    const handleChange = e => {
        setGrid({
            ...grid,
            [e.target.name]: e.target.value
        })
    }

    // handle interval change manually
    const handleIntervalChange = e => {
        setGame({
            ...game,
            interval: e.target.value
        })
    }
    return (
        <div className='game'>
            <div className='game-of-life'>
                <div className='game-grid' 
                    style={{
                        width: grid.width, 
                        height: grid.height, 
                        backgroundSize: `${grid.cellSize}px ${grid.cellSize}px`}} 
                        ref = {(n) => setBoardRef(n)}
                        onClick={(e) => {if (!game.isRunning){handleClick(e)}}}
                        >
                        {cells.map(cell => (
                            <Cell x={cell.x} y={cell.y} cellSize={grid.cellSize} 
                            key={`${cell.x}, ${cell.y}`} 
                            />
                        )
                        )}
                </div>

                <p className='generation-counter'>Generation: {game.generation}</p>
                <div className='input-container'>
                    <div className='input'>
                        <label htmlFor='height'>Grid Height</label>
                        <input className='grid-size-input' type='text' id ='height' name='height' value={grid.height} onChange={handleChange}></input>
                    </div>

                    <div className='input'>
                        <label htmlFor='width'>Grid Width</label>
                        <input className='grid-size-input' type='text' id='width' name='width' value={grid.width} onChange={handleChange}></input>
                    </div>

                    <div className='input'>
                        <label htmlFor='height'>Cell Size</label>
                        <input className='grid-size-input' type='text' id='cellSize' name='cellSize' value={grid.cellSize} onChange={handleChange}></input>
                    </div>

                    <div className='input'>
                        <label htmlFor='interval'>Interval</label>
                        <input className='game-interval' type='text' id='interval' name='interval' value={game.interval} onChange={handleIntervalChange}></input>
                    </div>
                </div>
            </div>
            {/* <Buttons 
                makeFaster={makeFaster} 
                makeSlower={makeSlower} 
                runGame={runGame} 
                stopGame={stopGame} 
                handleClear = {handleClear}
                handleRandom = {handleRandom}
                runIteration = {runIteration}
            /> */}
            <div className='buttons-container'>
            <div className='buttons-header'>
                Controls
            </div>
            <div className='button-div'>
                <button className='button' onClick={handleRandom}>
                    Random Fill
                </button>
            </div>
            <div className='button-div'>
                <button className='button' onClick={handleClear}>
                    Clear
                </button>
            </div>
            <div className='button-div'>
                <button className='button' onClick={handleRun}>
                    Run
                </button>
            </div>
            <div className='button-div'>
                <button className='button' onClick={handleStop}>
                    Stop
                </button>
            </div>
            <div className='button-div'>
                <button className='button' onClick={makeFaster}>
                    Faster
                </button>
            </div>
            <div className='button-div'>
                <button className='button' onClick={makeSlower}>
                    Slower
                </button>
            </div>
            <div className='button-div'>
                <button className='button' onClick={runIteration}>
                    Next Generation
                </button>
            </div>
            
        </div>
        </div>
    )
}