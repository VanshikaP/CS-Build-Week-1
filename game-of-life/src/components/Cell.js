import React from 'react';

export default function Cell({i, j, cellSize}){
    return (
        <div className='cell'
            style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                left: `${cellSize * j + 1}px`,
                top: `${cellSize * i + 1}px`
            }}
        />
    )
}