// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import {useRef, useState, useEffect} from 'react';
import styles from './streamVideo.module.css';

export default function StreamVideo(props) {
    //const { stream, remote_peer_id } = props;
    const { stream, reduce_stream, remote_peer_id, my_peer,isCalling } = props;
    let { call } = props;

    //const [c_stream,set_c_stream] = useState(stream);
    const ref = useRef(null);
    console.log('StreamVideo , props :', props);
    console.log('StreamVideo , stream :', stream);
    //console.log('StreamVideo, c_stream :', c_stream);
    
    useEffect(() => {
        if(stream && ref.current && remote_peer_id && my_peer) {
            //ref.current.srcObject = stream;
            if(!isCalling && !call){
                //if not calling then we call
                console.log('calling from component')
                call = my_peer.current.call(remote_peer_id,stream)
                call.on('stream', (remoteStream : MediaStream) => {
                    console.log('stream received from call with component', remoteStream);
                    if(ref.current){
                        ref.current.srcObject = remoteStream;
                    }
                });
            }else{
                //if calling then we answer
                console.log('answering from component')
                call.answer(stream)
                call.on('stream', (remoteStream : MediaStream) => {
                    console.log('stream received from call with component', remoteStream);
                    if(ref.current){
                        ref.current.srcObject = remoteStream;
                    }
                });
                call.on('close', () => {
                    console.log('a peer closed call')
                });

            }
            console.log('StreamVideo component , call peer :', remote_peer_id);

        }

    } ,[stream])
    //
    //
    //making call from this component
    //involves my_stream and ref 
    //
    //

    const stopStream = async () => {
        const tracks = ref.current.srcObject.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        ref.current.srcObject = null;
        reduce_stream();
    }

    

    
    return(
        <div className={styles.all}>
            <p> StreamVideo of : {remote_peer_id}  </p>
            <video ref = {ref} autoPlay />
            <button onClick={stopStream}> close </button>
        </div>
    )
}

