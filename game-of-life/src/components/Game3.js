import React, { Component, useState } from 'react';
import Cell from './Cell'

export class Game3 extends Component {

    constructor() {
        super();
        // grid variables
        this.gridHeight = 1000;
        this.gridWidth = 1000;
        this.cellSize = 30
        this.rows = Math.floor(this.gridHeight / this.cellSize)
        this.cols = Math.floor(this.gridWidth / this.cellSize)

        // grid board initialized to empty board
        this.board = this.makeEmptyBoard()
    }

    // state to hold game variables
    state = {
        cells: [],
        generation: 0,
        isRunning: false,
        interval: 1000,
        cellColor: 'white',
        gridHeight: 1000,
        gridWeight: 1000,
        cellSize: 100,

    }

    // make empty board
    makeEmptyBoard() {
        let board = [];
        for (let y = 0; y < this.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }

        return board;
    }

    // get coordinates relative to game grid
    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }

    // create cells[store live cells] from board
    makeCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    // handle cell toggling
    handleClick = (e) => {

        const elemOffset = this.getElementOffset();
        const offsetX = e.clientX - elemOffset.x;
        const offsetY = e.clientY - elemOffset.y;
        
        const x = Math.floor(offsetX / this.cellSize);
        const y = Math.floor(offsetY / this.cellSize);

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
        }

        this.setState({ cells: this.makeCells() });
    }

    // Game functions

    // calculate live neighbors for given cell
    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    // update the board according to the rules
    runIteration() {
        // console.log('running the iteration', this.state.generation);
        this.setState({generation: this.state.generation + 1});
        let newBoard = this.makeEmptyBoard();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });

    }

    // run the simulation
    handleRun = () => {
        this.setState({ isRunning: true });
        // run iteration after each interval
        this.intervalHandler = window.setInterval(() => {
            this.runIteration();
        }, this.state.interval);
    }

    // stop the simulation
    handleStop = () => {
        this.setState({ isRunning: false });
        if (this.intervalHandler) {
            window.clearInterval(this.intervalHandler);
            this.intervalHandler = null;
        }
    }

    // random filling
    handleRandom = () => {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.board[y][x] = (Math.random() >= 0.5);
            }
        }

        this.setState({ cells: this.makeCells(), generation: 0 });
    }

    // clear the board
    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells(), generation: 0 });
    }

    // change interval
    makeFaster = () => {
        this.setState({ interval: 0.5 * this.state.interval})
    }

    makeSlower = () => {
        this.setState({ interval: 2 * this.state.interval})
    }

    // change grid size, cell size and interval
    handleDimensionChange = e => {
        this.gridHeight = e.target.value
        this.gridWidth = e.target.value
        this.rows = Math.floor(e.target.value / this.cellSize)
        this.cols = Math.floor(e.target.value/ this.cellSize)
        // this.setState({
        //     gridHeight: e.target.value,
        //     gridWidth: e.target.value
        // })
    }

    handleCellChange = e => {
        this.cellSize = e.target.value
        // this.rows = Math.floor(this.gridHeight / this.cellSize)
        // this.cols = Math.floor(this.gridWidth / this.cellSize)
        // this.setState({ cellSize: e.target.value })
    }

    handleIntervalChange = e => {
        this.setState({interval: e.target.value})
    }

    handleCellColorChange = e => {
        this.setState({ cellColor: e.target.value})
    }

    render() {
        return (
            <div className='game'>
            <div className='game-of-life'>
                <div className='game-grid' 
                    style={{
                        width: this.gridWidth, 
                        height: this.gridHeight, 
                        backgroundSize: `${this.cellSize}px ${this.cellSize}px`}} 
                        ref = {(n) => { this.boardRef = n; }}
                        onClick={(e) => {if (!this.state.isRunning){this.handleClick(e)}}}
                        >
                        {this.state.cells.map(cell => (
                            <Cell x={cell.x} y={cell.y} cellSize={this.cellSize} color={this.state.cellColor}
                            key={`${cell.x}, ${cell.y}`} 
                            />
                        )
                        )}
                </div>

                <p className='generation-counter'>Generation: {this.state.generation}</p>
                <div className='input-container'>
                    <div className='input'>
                        <label htmlFor='height'>Grid Size</label>
                        <input className='grid-size-input' id ='height' name='height' value={this.gridHeight} onChange={this.handleDimensionChange}></input>
                    </div>

                    <div className='input'>
                        <label htmlFor='cellSize'>Cell Size</label>
                        <input className='cell-size-input' id='cellSize' name='cellSize' value={this.cellSize} onChange={this.handleCellChange}></input>
                    </div>
                    <div className='input'>
                        <label htmlFor='cellColor'>Cell Color</label>
                        <select id='cellColor' name='cellColor' onChange={this.handleCellColorChange}>
                            <option value='white'>white</option>
                            <option value='red'>red</option>
                            <option value='blue'>blue</option>
                        </select>
                    </div>

                    <div className='input'>
                        <label htmlFor='interval'>Interval</label>
                        <input className='game-interval' id='interval' name='interval' value={this.state.interval} onChange={this.handleIntervalChange}></input>
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
                    <button className='button' onClick={this.handleRandom}>
                        Random Fill
                    </button>
                </div>
                <div className='button-div'>
                    <button className='button' onClick={this.handleClear}>
                        Clear
                    </button>
                </div>
                <div className='button-div'>
                    <button className='button' onClick={this.handleRun}>
                        Run
                    </button>
                </div>
                <div className='button-div'>
                    <button className='button' onClick={this.handleStop}>
                        Stop
                    </button>
                </div>
                <div className='button-div'>
                    <button className='button' onClick={this.makeFaster}>
                        Faster
                    </button>
                </div>
                <div className='button-div'>
                    <button className='button' onClick={this.makeSlower}>
                        Slower
                    </button>
                </div>
                <div className='button-div'>
                    <button className='button' onClick={() => this.runIteration()}>
                        Next Generation
                    </button>
                </div>
                
            </div>
        </div>
        )
    }
}

export default Game3
