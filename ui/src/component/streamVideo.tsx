// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import {useRef, useState, useEffect} from 'react';


export default function StreamVideo(props) {
    //const { stream, remote_peer_id } = props;
    const { stream } = props;

    //const [c_stream,set_c_stream] = useState(stream);
    const ref = useRef(null);
    console.log('StreamVideo , props :', props);
    console.log('StreamVideo , stream :', stream);
    //console.log('StreamVideo, c_stream :', c_stream);
    
    useEffect(() => {
        if(stream && ref.current) {
            ref.current.srcObject = stream;
        }

    } ,[stream])
    //
    //
    //making call from this component
    //involves my_stream and ref 

    

    
    return(
        <div>
            <p> StreamVideo </p>
            <video ref = {ref} autoPlay />
            <button> close </button>
        </div>
    )
}

