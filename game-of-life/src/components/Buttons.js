import React from 'react';

export default function Buttons(){
    return (
        <div className='buttons-container'>
            <div className='buttons-header'>
                Controls
            </div>
            <div className='button-div'>
                <button className='button'>
                    Button 1
                </button>
            </div>
            <div className='button-div'>
                <button className='button'>
                    Button 2
                </button>
            </div>
            <div className='button-div'>
                <button className='button'>
                    Button 3
                </button>
            </div>
        </div>
    )
}