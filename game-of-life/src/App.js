import React from 'react';
import './App.css';
import GameOfLife from './components/GameOfLife';
import Buttons from './components/Buttons';
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
        <div className='game'>
          <GameOfLife />
          <Buttons />
        </div>
        <div className = 'about'>
          <About />
        </div>
      </div>
    </div>
  )
}

export default App
