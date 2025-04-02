
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { io } from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

import ClassInfo from '@/component/class_info';
import { BASE, fetchClassInfo } from '@/fetchData';
import styles from './test_ext_feed.module.css';



export default function Page(props) {
    const params = useSearchParams();
    const class_id  = params.get('class_id');

    const [my_stream, set_my_stream] = useState(null);
    const [ streamON , set_streamON ] = useState(false);
    const [ interval_id, set_interval_id ] = useState(null);
    const [ notifs , setNotifs ] = useState([]);

    const my_video_ref = useRef <HTMLVideoElement | null>(null);
    const notif_ref = useRef(null);

    const canvas = useRef(null);
    const test_canvas = useRef(null);
    const socket = useRef(null);
    
    //effect for creating the socket
    useEffect(() => {
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

        //socket_client.on('attendance', (data) => {
        //    console.log('attendance:', data);
        //    set_attendance(data.attendance);
        //});

        socket_client.on('received_pic', () => {
            let tm = new Date().toLocaleTimeString();
            setNotifs((old) =>{
                notif_ref.current.scrollTop = notif_ref.current.scrollHeight;
                return [...old , `> ${tm} - image sent to server.`]
            });
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
                setNotifs((old) =>{
                    notif_ref.current.scrollTop = notif_ref.current.scrollHeight;
                    return [ ...old,...n_notifs]
                }) ;
        });

        socket_client.on('feedback', (data) => {
            console.log('feedback :', data.feedback);
            if (data.feedback.processed) {
                console.log('show feedback');
                let processedImage = new Image();
                processedImage.onload = () => {
                    //console.log('onload processedImage src :', processedImage.src)
                    const ctx = test_canvas.current.getContext('2d');
                    test_canvas.current.setAttribute('width', processedImage.width);
                    test_canvas.current.setAttribute('height', processedImage.height);
                    ctx.clearRect(0, 0, test_canvas.width, test_canvas.height);
                    ctx.drawImage(processedImage, 0, 0)
                };
                processedImage.src = data.feedback.image;
            }
        });

        socket.current = socket_client;

        //initialize stream is by button
        
        return () => {
            console.log('cleanup all interval_id', interval_id)
            set_interval_id((old) => {
                console.log('set_interval_id null');
                clearInterval(old);
                return null;
            })
            socket.current.close();
        }
    },[])


    useEffect(() => {
        console.log('my_stream useEffect');
        const start_send_stream = async (interv) => {
            console.log('start_send_stream');
            await send_picture(interv);
        }

        console.log('my_stream useEffect, interval_id ',interval_id);
        if(!interval_id && streamON) {
            console.log('interval_id to be created again :', interval_id);
            start_send_stream(14000);
        }

        return () => {
            console.log('my_stream useEffect cleanup');
            //set_interval_id((old) => {
            //    console.log('set_interval_id null');
            //    clearInterval(old);
            //    return null;
            //})
        }
        
    },[my_stream]);

    const take_picture = () => {
        console.log('tak_picture width :',my_video_ref.current);
        console.log('take_picture interval_id ',interval_id);
        let data = null;
        if ( my_video_ref.current ){
            //need to resize for image too big for socket
            const width = my_video_ref.current.videoWidth /2;
            const height = my_video_ref.current.videoHeight /2;
            console.log('take_picture ',width, height,my_video_ref);
            canvas.current.setAttribute('width', width);
            canvas.current.setAttribute('height', height);
            const context = canvas.current.getContext('2d');
            context.drawImage(my_video_ref.current, 0, 0, width, height);
            data = new Promise(resolve => canvas.current.toBlob(resolve));
        }
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
            console.log('data we send inside interval creation ', blob_pic);
            console.log('interval callback, interval_id', interval_id);
            
            if (blob_pic) {
                socket.current.emit('stream_class_no_save', {class_id : class_id, blob : blob_pic });
            }
        }, interv);
        console.log('interval_id :', new_interval_id);
        set_interval_id((old) => {
            console.log('set_interval_id new_value');
            clearInterval(old);
            return new_interval_id;
        });
    }

    const get_ext_feed_stream = async () => {
        console.log('get_ext_feed_stream');
        try {
            console.log('get_ext_feed_stream');
            let new_my_stream = await navigator.mediaDevices.getDisplayMedia({ 
                video : {cursor : 'always'}, 
                audio : false
            });
            set_my_stream(new_my_stream);
            set_streamON(true);
            my_video_ref.current.srcObject = new_my_stream;
            //my_video_ref.current.play();
        } catch (err) {
            console.log("error in get_stream :",err);

        }
    }

    const off_stream = () => {
        console.log('off_stream');
        set_streamON(false);
        if(my_video_ref.current.srcObject){
            const tracks = my_video_ref.current.srcObject.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            my_video_ref.current.srcObject = null;
            set_my_stream(null);
            set_interval_id((old)=> {
                console.log('set_interval_id null');
                clearInterval(old)
                return null;
            });
        }
    }

    const take_attendance = async () => {
        console.log('take_attendance');
        const blob_pic = await take_picture();
        console.log('data we send inside take_attendance ', blob_pic);
        if (blob_pic) {
            socket.current.emit('stream_class_no_save', {class_id : class_id, blob : blob_pic });
        }
    }
    



    
    let notifsDisplay ;
    if(notifs) {
        notifsDisplay = notifs.map(notif => 
                                   <p key={notif}> {notif} </p>
                                  )
    }

    if( notif_ref.current ){
        notif_ref.current.scrollTop = notif_ref.current.scrollHeight;
    }

    return (
        <div className={styles.all} >
            <div className = {styles.display} >
                <div>
                    <ClassInfo class_id={class_id} />
                </div>
                <div className={styles.video_container}>
                    <video ref={my_video_ref} className={styles.video_display} autoPlay/>
                    <canvas ref={ canvas } >
                    </canvas>
                </div>
                <div>
                    <button
                    onClick = {get_ext_feed_stream}>
                        start
                    </button>
                    <button
                    onClick = {take_attendance}>
                    Take attendance
                    </button>
                    <button
                    onClick = {off_stream}>
                        stop
                    </button>

                </div>
                <div className={styles.feedback}>
                    <canvas ref = {test_canvas}>
                    </canvas>
                </div>
            </div>
            <div className = {styles.notifs} ref = {notif_ref} >
                {notifsDisplay}
            </div>
        </div>
    );

}
