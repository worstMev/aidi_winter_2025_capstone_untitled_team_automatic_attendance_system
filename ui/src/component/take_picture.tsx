'use client';

import { useRef } from 'react'
import styles from './take_picture.module.css';

export default function TakePicture() {
    const video_ref = useRef(null);
    const canvas = useRef(null);
    const output = useRef(null);
    

    const start_capture = async () => {
        console.log('start capture');
        try {
            const video_stream = await navigator.mediaDevices.getUserMedia({ video : true , audio : false });
            video_ref.current.srcObject = video_stream;
            video_ref.current.play();
            
        } catch (err) {
           console.log('error in start capture:', err) 
        }
    }

    const take_picture = async () => {
        const width = video_ref.current.videoWidth;
        const height = video_ref.current.videoHeight;
        console.log('take_picture',width, height);
        canvas.current.setAttribute('width', width);
        canvas.current.setAttribute('height', height);
        const context = canvas.current.getContext('2d');
        context.drawImage(video_ref.current, 0, 0, width, height);
        const data = canvas.current.toDataURL('image/png');
        output.current.setAttribute( 'src' , data);
    }

    return(
        <div className={styles.take_picture}>
            <p> take picture from webcam here </p>
            <div className = {styles.display} >
                <div>
                    <video ref={video_ref}>video not available</video> 
                </div>
                <div>
                    <button onClick={start_capture}> start </button>
                    <button onClick={take_picture}> Take picture </button>
                </div>
                <canvas ref={ canvas } >
                </canvas>
                <div className="output" >
                    <img alt="picture will appear here" ref ={output}/>
                </div>
            </div>
        </div>
    )
}
