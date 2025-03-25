// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { io } from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

import { BASE } from '@/fetchData';
import styles from './test_attendance.module.css';

export default function Page(props) {
    const params = useSearchParams();
    const class_id  = params.get('class_id');

    const [my_peer_id, set_my_peer_id] = useState(''); 
    const [remote_peer_id, set_remote_peer_id] = useState('');

    //control number of stream for testing
    const [n_stream, set_n_stream] = useState(0);
    const [my_stream, set_my_stream] = useState(null);

    const [ interval_id, set_interval_id ] = useState(null);

    const [ notifs , setNotifs ] = useState([]);
    

    //show attendance
    const [attendance,set_attendance] = useState([]);

    const my_video_ref = useRef <HTMLVideoElement | null>(null);

    const canvas = useRef(null);
    const socket = useRef(null);

    //effect for creating the socket
    useEffect(() => {

        //initialize the socket
        const socket_client = io( BASE,
                    { path : '/ws/socket.io/' });

        socket_client.on( 'connect' , () => {
            console.log('socket connect, id :', socket_client.id);
        });
        socket_client.on('disconnect', () => {
            console.log('socket disconnected');
        });
        socket_client.on('hello' , () => {
            console.log('hello event');
        });
        socket_client.on('message', (data) => {
            console.log('message :', data);
        });
        socket_client.on('detection' , (data) => {
            console.log('detection :', data);
        });
        socket_client.on('attendance', (data) => {
            console.log('attendance:', data);
            set_attendance(data.attendance);
        });

        socket_client.on('recognized', (data) => {
            console.log('recognized :', data.recognized);
            let n_notifs = []
            for ( let p of data.recognized ){
                console.log('p:',p)
                let tm = new Date().toLocaleTimeString();
                let n_notif = `> ${tm} - ${p.student_name} recognized.`;
                n_notifs.push(n_notif)
            }
                setNotifs((old) => [ ...old,...n_notifs]) ;
        });

        socket.current = socket_client;

        //ini stream and send stream
        
        const initialize_stream = async () => {
            await get_stream();
        }
        

        initialize_stream();

        return () => {
            clearInterval(interval_id);
            socket.current.close();
        }
    },[]);


    //effect for sending stream to server
    useEffect(() => {
        console.log('my_stream useEffect');
        const start_send_stream = async (interv) => {
            console.log('start_send_stream');
            await send_picture(interv);
        }

        start_send_stream(14000);

        return () => {
            console.log('my_stream useEffect cleanup');
        }
        
    },[]);
    
    const take_picture = () => {
        console.log('tak_picture width :',my_video_ref.current);
        const width = my_video_ref.current.videoWidth;
        const height = my_video_ref.current.videoHeight;
        console.log('take_picture ',width, height,my_video_ref);
        canvas.current.setAttribute('width', width);
        canvas.current.setAttribute('height', height);
        const context = canvas.current.getContext('2d');
        context.drawImage(my_video_ref.current, 0, 0, width, height);
        let data = new Promise(resolve => canvas.current.toBlob(resolve));
        return data;
    }

    //send picture of stream
    const send_picture = async (interv=10000) => {
        const blob_pic = await take_picture();
        console.log('data we send ', blob_pic);
        //if(blob_pic) {
        //    socket.current.emit('stream_class', {class_id : class_id, blob : blob_pic });
        //    setNotifs((old) => [...old , '- image sent to server']);
        //} else {
        //    //define an interv ?
        //}
        let new_interval_id = setInterval( async () => {
            const blob_pic = await take_picture();
            console.log('data we send ', blob_pic);
            if (blob_pic) {
                socket.current.emit('stream_class', {class_id : class_id, blob : blob_pic });
                let tm = new Date().toLocaleTimeString();
                setNotifs((old) => [...old , `> ${tm} - image sent to server`]);
            }
        }, interv);
        console.log('interval_id :', new_interval_id);
        set_interval_id(new_interval_id);
    }

    const get_stream = async () => {
        try {
            console.log('get_stream');
            let new_my_stream = await navigator.mediaDevices.getUserMedia({ video : true, audio : true});
            set_my_stream(new_my_stream);
            my_video_ref.current.srcObject = new_my_stream;
            //my_video_ref.current.play();


        } catch (err) {
            console.log("error in get_stream :",err);

        }
    }

    const off_stream = async () => {
        const tracks = my_video_ref.current.srcObject.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        my_video_ref.current.srcObject = null;
        clearInterval(interval_id);
    }

    let notifsDisplay ;
    if(notifs) {
        notifsDisplay = notifs.map(notif => 
                                   <p key={notif}> {notif} </p>
                                  )
    }

    return(
        <div className={styles.all} >
            <div className = {styles.display} >
                <div>
                    <p> class attendance test : {class_id} </p>
                </div>
                <div className={styles.video_container}>
                    <video ref={my_video_ref} className={styles.video_display} autoPlay/>
                    <canvas ref={ canvas } >
                    </canvas>
                </div>
                <div>
                    <button
                    onClick = {get_stream}>
                        start
                    </button>
                    <button
                    onClick = {off_stream}>
                        stop
                    </button>
                </div>
            </div>
            <div className = {styles.notifs} >
                {notifsDisplay}
            </div>
        </div>
    )
}
