import React, {useState, useEffect} from 'react';

export default function Game2(){
    const [w, setW] = useState(500)
    const [c, setC] = useState('black')
    const [isRunning, setIsRunning] = useState(false);
    const [i, setI] = useState(null);
    // const interval = null;
    const changeBox = () => {
        console.log('changing box', w, c)
        setW(w + 50)
    }

    const handleRun = () => {
        setIsRunning(true)
        setI(window.setInterval(() => {
            setW(w+50)
        }, 1000))
    }
    const handleStop = () => {
        setIsRunning(false)
        if(i){
            window.clearInterval(i);
            setI(null);
        }
    }

    return (
        <div className='outer-box'>
            <div className='inner-box' style={{width: `${w}px`, height: `${w}px`, background: `${c}`}}></div>
            <button className='button-test' onClick={handleRun}>Run</button>
            <button className='button-test' onClick={handleStop}>Stop</button>
            <button className='button-test' onClick={changeBox}>Change</button>
        </div>
    )
}