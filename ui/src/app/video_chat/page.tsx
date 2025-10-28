// eelint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { io } from 'socket.io-client';

import styles from './video_chat.module.css';
import StreamVideo from './../../component/streamVideo.tsx';

import { BASE } from '@/fetchData';

export default function Page() {
    const [my_peer_id, set_my_peer_id] = useState(''); 
    const [remote_peer_id, set_remote_peer_id] = useState(''); 
    const [ remote_peer_ids , set_remote_peer_ids ] = useState([]);
    const [ remote_peer_ids_call , set_remote_peer_ids_call ] = useState([]);
    const [n_stream, set_n_stream] = useState(0);
    const [my_stream, set_my_stream] = useState(null);
    const [ interval_id, set_interval_id ] = useState(null);

    const [attendance,set_attendance] = useState([]);

    const remote_video_ref = useRef <HTMLVideoElement | null>(null);
    const my_video_ref = useRef <HTMLVideoElement | null>(null);
    const peer_instance = useRef <Peer | null>(null);
    const canvas = useRef(null);
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
            set_attendance(data.attendance);
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


        //get the stream and start sending pic
        //cleanup
        return () => {
            clearInterval(interval_id);
            socket.current.close();
        }
    },[my_video_ref]);

    //when stream on start sending stream
    useEffect(() => {
        console.log('my_stream useEffect');
        const start_send_stream = async (interv) => {
            console.log('start_send_stream');
            await send_picture(interv);
        }

        start_send_stream(14000);
        //start_send_stream(5000);

        return () => {
            console.log('my_stream useEffect cleanup');
        }
        
    },[]);
    
    //calling a peer
    const call = async (remotePeerId : string ) => {
        try{
            console.log('call :',remotePeerId);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if ( my_video_ref.current ) {
                my_video_ref.current.srcObject = mediaStream;
                my_video_ref.current.play();
                const call = peer_instance.current.call(remotePeerId, mediaStream)

                call.on('stream', ( remoteStream : MediaStream ) => {
                    console.log('stream received from my call', remoteStream);
                    if( remote_video_ref.current ){
                        remote_video_ref.current.srcObject = remoteStream
                        remote_video_ref.current.play();
                    }
                });
            }
        }catch(err){
            console.log('error in call(remotePeerId):', err)
        }

    }

    const create_call = async (remote_peer_id) =>{
        console.log('create a stream component for ',remote_peer_id)
        if(my_stream){
            //add remote_peer_id to remote_peer_ids
            set_remote_peer_ids((old) => [ ...old, { peer_id : remote_peer_id, isCalling : false}]);
        }else{
            console.log('needs to ini stream');
        }
    }

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

    /* TODO
    const callMany = (remote_peer_ids) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {

            my_video_ref.current.srcObject = mediaStream;
            my_video_ref.current.play();

            for ( remote_peer_id in remote_peer_ids ) {
                //call every remote peer
                const call = peer_instance.current.call(remotePeerId, mediaStream)

                //create a video for every peer ? dynamic rendering
                call.on('stream', (remoteStream) => {
                    remote_video_ref.current.srcObject = remoteStream
                    remote_video_ref.current.play();
                });
            }

        });
    }
    */

   //get my stream
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

   //off my stream , doesn't off Streamvideo stream
   const off_stream = async () => {
        const tracks = my_video_ref.current.srcObject.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        my_video_ref.current.srcObject = null;
   }

   const add_stream = async () => {
       //add another stream
       //create a new ref
       set_n_stream(n_stream + 1);
       console.log('add stream :', n_stream);
       //let new_streamVids = [];
       //for( let i = 0; i<n_stream ; i++){
       //}
   }

   const reduce_stream = () => {
       set_n_stream(n_stream - 1);
       console.log('reduce stream :', n_stream);
   }

   //take picture of my_stream
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
       console.log('send_picture interv :',interv)
       console.log('data we send ', blob_pic);
       if(blob_pic) {
           socket.current.emit('stream', { blob : blob_pic });
       } else {
           //define an interv ?
       }
       let new_interval_id = setInterval( async () => {
           const blob_pic = await take_picture();
           console.log('data we send ', blob_pic);
           if (blob_pic) socket.current.emit('stream', { blob : blob_pic });
       }, interv);
       console.log('interval_id in send_picture :', new_interval_id);
       set_interval_id((old) => {
           clearInterval(old);
           return new_interval_id
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
                reduce_stream={()=> console.log('reduce stream')}
                remote_peer_id = {remote_peer_id}
                my_peer = {peer_instance}
                isCalling = {isCalling}
                call = {remote_peer.call}
                key = {remote_peer_id}
               />
           )
       });
   }



   //display attendance
   
   let attendance_disp;
   if ( attendance.length ) {
       attendance_disp = attendance.map( (person,index) =>
        <li key={index} > {person} </li>
       );
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
                    <p> starting video ... </p>
                    <h1>Current user id is {my_peer_id}</h1>
                    <video ref={my_video_ref} autoPlay/>
                    <canvas ref={ canvas } >
                    </canvas>
                    <div>
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
                    { attendance_disp }
                    </ul>
                </div>
                <button onClick={get_stream}> stream on </button>
                <button onClick={add_stream}> + </button>
                <button onClick={reduce_stream}> - </button>
                <button onClick={off_stream}> stream off </button>
                <button onClick={send_picture}> send my stream </button>
                <button onClick={stop_sending_stream}> stop sending my stream </button>
                <button onClick={send_message}>send xxx</button>
            </div>
        </div>
    );
}
