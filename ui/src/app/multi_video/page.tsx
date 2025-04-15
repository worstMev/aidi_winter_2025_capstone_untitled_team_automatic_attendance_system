// eelint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { io } from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

import styles from './multi_video.module.css';
import StreamVideo from './../../component/streamVideo.tsx';


import { BASE } from '@/fetchData';

export default function Page() {
    const params = useSearchParams();
    const class_id  = params.get('class_id');
    const [ my_peer_id, set_my_peer_id ] = useState('');

    const [ streamON , set_streamON ] = useState(true);
    const [ remote_peer_ids , set_remote_peer_ids ] = useState([]); //remote peer
    const [ remote_peer_ids_call , set_remote_peer_ids_call ] = useState([]);//remote peer we actually call [{peer_id, isCalling, call}]

    const [ my_stream, set_my_stream] = useState(null);
    const [ interval_id, set_interval_id ] = useState(null);

    const [ notifs , setNotifs ] = useState([]);

    const my_video_ref = useRef <HTMLVideoElement | null>(null);
    const peer_instance = useRef <Peer | null>(null);
    const notif_ref = useRef(null);

    const canvas = useRef(null);
    const feedback_canvas = useRef(null);
    const socket = useRef(null);

    



    useEffect( () => {
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
        });

        socket_client.on('new_peer_registered' , () => {
            console.log('new_peer_registered, get peer ids');
            socket.current.emit('get_peers_id', 'my_class');
        });

        socket_client.on('peer disconnected' , () => {
            console.log('peer disconnected');
            socket.current.emit('get_peers_id','my_class');
        });

        socket_client.on('remote_peer_ids', (data) => {
            console.log('remote_peer_ids' , data)
            set_remote_peer_ids(data)
        });

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
                    const ctx = feedback_canvas.current.getContext('2d');
                    feedback_canvas.current.setAttribute('width', processedImage.width);
                    feedback_canvas.current.setAttribute('height', processedImage.height);
                    ctx.clearRect(0, 0, feedback_canvas.width, feedback_canvas.height);
                    ctx.drawImage(processedImage, 0, 0)
                };
                processedImage.src = data.feedback.image;
            }
        });

        socket.current = socket_client;
        
        //initialize the peer
        const peer = new Peer();

        peer.on('open', ( id : string ) => {
            set_my_peer_id((old) => {
                //send peer id to server
                socket.current.emit('peer_id', id)
                return id;
            })
        });

        peer.on('call',async (call : MediaConnection ) => {
            //when someone calls
            let caller_peer_id = call.peer;
            console.log('someone calling you, call', caller_peer_id);
            try{
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if ( my_video_ref.current ){
                    my_video_ref.current.srcObject = mediaStream;
                    my_video_ref.current.play();
                    set_my_stream(mediaStream);
                    set_remote_peer_ids_call((old) => [ ...old, {peer_id : caller_peer_id, isCalling : true, call}])
                }
            }catch(err){
                console.log('error in peer.on(call):',err);
            }
        })
        peer_instance.current = peer;


        const initialize_stream = async () => {
            console.log('initialize stream');
            await get_stream();
        }
        

        initialize_stream();
        //cleanup
        return () => {
            console.log('cleanup all interval_id', interval_id)
            set_interval_id((old) => {
                console.log('set_interval_id null');
                clearInterval(old);
                return null;
            })
            socket.current.close();
        }
    },[]);

    //when stream on start sending stream
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
            //start_send_stream(5000);
        }

        return () => {
            console.log('my_stream useEffect cleanup');
        }
        
    },[my_stream]);
    


    const callMany = async () => {
        console.log('call everyone, remotes :', remote_peer_ids)
        if( my_stream ) {
            let rm_stream_call = remote_peer_ids.map((peer_id) => ({ peer_id : peer_id , isCalling : false }));
            console.log(rm_stream_call)
            set_remote_peer_ids_call(rm_stream_call)
        }else{
            console.log('callMany :no stream yet')
        }
    }


   //get my stream
   const get_stream = async () => {
       try {
           console.log('get_stream');
           let new_my_stream = await navigator.mediaDevices.getUserMedia({ video : true, audio : true});
           set_my_stream(new_my_stream);
           set_streamON(true);
           my_video_ref.current.srcObject = new_my_stream;
           //my_video_ref.current.play();
       } catch (err) {
           console.log("error in get_stream :",err);

       }
   }

   //off my stream , doesn't off Streamvideo stream
   const off_stream = async () => {
        console.log('off stream');
        set_streamON(false);
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
   
   //take picture of my_stream
   const take_picture = () => {
        console.log('tak_picture width :',my_video_ref.current);
        console.log('take_picture interval_id ',interval_id);
        let data = null;
        if ( my_video_ref.current ){
            const width = my_video_ref.current.videoWidth;
            const height = my_video_ref.current.videoHeight;
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
        if (streamON && !interval_id){
            //never called somehow
            const blob_pic = await take_picture();
            console.log('data we send first ', blob_pic);
            if (blob_pic) {
                socket.current.emit('stream_class_no_save', {class_id : class_id, blob : blob_pic });
            }
        }
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

   const stop_sending_stream = () => {
       console.log('stop_sending_stream interval_id:',interval_id);
       set_interval_id( (old) => {
           clearInterval(old);
           return null;
       });
       clearInterval(interval_id);
   }

   const remove_peer_from_call = (peer_id) => {
       set_remote_peer_ids_call((old) => {
           let no_closed_peer_ids = old.filter( el => el.peer_id != peer_id);
           return no_closed_peer_ids;

       });
   }

   //test emit
   const send_message = () => {
       socket.current.emit('message', 'xxxx');
   }

   let array_peer_vids_list = <p> array_peer_vids_list </p>;
   let array_peer_vids = <p> array_peer_vids </p>;
   if( remote_peer_ids.length ) {
       console.log('define list for remote_peer_ids:', remote_peer_ids)
       array_peer_vids_list = remote_peer_ids.map((remote_peer,index) => {
           console.log('remote_peer' , remote_peer);
           const remote_peer_id = remote_peer.peer_id;
           const isCalling = remote_peer.isCalling;
           return(
               <p key={remote_peer} > {index+1} - {remote_peer} </p>
           )
       });
   }

   if( remote_peer_ids_call.length ) {
       console.log('define display for remote_peer_ids:', remote_peer_ids)
       array_peer_vids = remote_peer_ids_call.map((remote_peer,index) => {
           console.log('remote_peer' , remote_peer);
           const remote_peer_id = remote_peer.peer_id;
           const isCalling = remote_peer.isCalling;
           return(
               <StreamVideo 
                stream={my_stream}
                reduce_stream={()=>remove_peer_from_call(remote_peer_id)}
                remote_peer_id = {remote_peer_id}
                my_peer = {peer_instance}
                isCalling = {isCalling}
                call = {remote_peer.call}
                key = {remote_peer_id}
               />
           )
       });
   }



    let notifsDisplay ;
    if(notifs) {
        notifsDisplay = notifs.map(notif => 
                                   <p key={notif}> {notif} </p>
                                  )
    }
   

   console.log('my_stream before render :', my_stream);

                     //<video ref={my_video_ref} autoPlay/> 
                    //{
                    ////<p> Peer video ... </p>
                    ////<video ref={remote_video_ref} autoPlay />
                    //}
                    //<input type="text" value={remote_peer_id} onChange={e => set_remote_peer_id(e.target.value)} />
                    //<button onClick={() => create_call(remote_peer_id)}>create Call</button>
   return(
        <div className={styles.main}>
            <div className={styles.display}>
                <div className={styles.mine}>
                    <video ref={my_video_ref} autoPlay/>
                    <canvas ref={ canvas } id={styles.pic_canvas} >
                    </canvas>
                    <div id={styles.ls_remote}>
                        remotes : 
                        { //remote_peer_ids 
                            array_peer_vids_list
                        }
                        <button
                            onClick={callMany}
                        >
                        call everyone
                        </button>
                    </div>
                    <div className={styles.feedback}>
                        <canvas ref = {feedback_canvas} id={styles.feedback_canvas}>
                        </canvas>
                    </div>
                </div>
                <div className={styles.others}>
                    {
                        array_peer_vids
                    }

                </div>
            </div>
            <div className={styles.test}>
                <div>
                    <p> Attendance : </p>
                    <ul>
                    </ul>
                </div>
                <button onClick={get_stream}> stream on </button>
                <button onClick={off_stream}> stream off </button>
                <button onClick={send_picture}> send my stream </button>
                <button onClick={stop_sending_stream}> stop sending my stream </button>
                <button onClick={send_message}>send xxx</button>
            </div>
            <div className = {styles.notifs} ref = {notif_ref} >
                {notifsDisplay}
            </div>
        </div>
    );
}
