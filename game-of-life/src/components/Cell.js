import React from 'react';

export default function Cell({x, y, cellSize}){
    return (
        <div className='cell'
            style={{
                width: `${cellSize - 1}px`,
                height: `${cellSize - 1}px`,
                left: `${cellSize * x + 1}px`,
                top: `${cellSize * y + 1}px`
            }}
        />
    )
}