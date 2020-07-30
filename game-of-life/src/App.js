import React from 'react';
import './App.css';
// import GameOfLife from './components/GameOfLife';
import Game from './components/Game';
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
        <Game />
        <div className = 'about'>
          <About />
        </div>
      </div>
    </div>
  )
}

export default App
