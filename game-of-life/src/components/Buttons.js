import React from 'react';

export default function Buttons({makeFaster, makeSlower, runGame, stopGame, handleRandom, handleClear, runIteration}){
    return (
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
                <button className='button' onClick={runGame}>
                    Run
                </button>
            </div>
            <div className='button-div'>
                <button className='button' onClick={stopGame}>
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
    )
}