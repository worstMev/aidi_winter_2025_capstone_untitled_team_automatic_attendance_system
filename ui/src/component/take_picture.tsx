"use client";
import { useRef, useEffect } from 'react';
import styles from './take_picture.module.css';

export default function TakePicture(props) {


    let { pictureTaken } = props;
    const video_ref = useRef<HTMLVideoElement | null>(null);
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const output = useRef<HTMLImageElement | null>(null);

    const start_capture = async (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('start capture');
        try {
            const video_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (video_ref.current) {
                video_ref.current.srcObject = video_stream;
                video_ref.current.play();
            }
        } catch (err) {
            console.log('error in start capture:', err);
        }
    };

    const off_stream = async (e: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (video_ref.current && video_ref.current.srcObject) {
            const tracks = (video_ref.current.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            video_ref.current.srcObject = null;
        }
        if (output.current && !pictureTaken) {
            output.current.src = ''; // Clear the image output
        }
    };

    const take_picture = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (video_ref.current && canvas.current && output.current) {
            const width = video_ref.current.videoWidth;
            const height = video_ref.current.videoHeight;
            console.log('take_picture', width, height);
            canvas.current.width = width;
            canvas.current.height = height;
            const context = canvas.current.getContext('2d');
            if (context) {
                context.drawImage(video_ref.current, 0, 0, width, height);
                const data = canvas.current.toDataURL('image/png');
                output.current.src = data;
                let data_pic = new Promise(resolve => canvas.current.toBlob(resolve));
                props.savePic(await data_pic)
            }
        }
    };

    useEffect(()=> {
        if(pictureTaken) off_stream();
    }, [pictureTaken]);


    return (
        <div className={styles.take_picture}>
        { !pictureTaken &&
            <>
            <div className={styles.videoContainer}>
                <video ref={video_ref} className={styles.video}>Video not available</video>
            </div>
            <div className={styles.controls}>
                <button onClick={start_capture} className={styles.button}>
                    Start
                </button>
                <button onClick={off_stream} className={styles.button}>
                    Stop
                </button>
                <button onClick={take_picture} className={styles.button}>
                    Take Picture
                </button>
            </div>
            </>
        }
          <div className={styles.outputContainer}>
            <img alt="Picture will appear here" ref={output} className={styles.outputImage} />
          </div>
          <canvas ref={canvas} style={{ display: 'none' }}></canvas>
        </div>
    );
}
