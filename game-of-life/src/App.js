import React from 'react';
import './App.css';
// import GameOfLife from './components/GameOfLife';
import Game from './components/Game';
import Game2 from './components/Game2';
import Game3 from './components/Game3';
import About from './components/About';

function App() {
  return (
    <div className="main-container">
      <header className="main-header">
        <p>
          Game of Life
        </p>
      </header>
      <div className='main-container-body'>
        {/* <GameOfLife /> */}
        {/* <Game /> */}
        {/* <Game2 /> */}
        <Game3 />
        <div className = 'about'>
          <About />
        </div>
      </div>
    </div>
  )
}

export default App
