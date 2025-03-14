// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import styles from './video_chat.module.css'; // Create a CSS module for styling

export default function Page() {
  const [my_peer_id, set_my_peer_id] = useState('');
  const [remote_peer_id, set_remote_peer_id] = useState('');
  const [isCalling, setIsCalling] = useState(false); // Track call status

  const remote_video_ref = useRef<HTMLVideoElement | null>(null);
  const my_video_ref = useRef<HTMLVideoElement | null>(null);
  const peer_instance = useRef<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id: string) => {
      set_my_peer_id(id);
    });

    peer.on('call', async (call: MediaConnection) => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (my_video_ref.current) {
          my_video_ref.current.srcObject = mediaStream;
          my_video_ref.current.play();
          call.answer(mediaStream);
          call.on('stream', (remoteStream: MediaStream) => {
            if (remote_video_ref.current) {
              remote_video_ref.current.srcObject = remoteStream;
              remote_video_ref.current.play();
            }
          });
        }
      } catch (err) {
        console.log('Error in peer.on(call):', err);
      }
    });

    peer_instance.current = peer;

    return () => {
      peer.destroy(); // Clean up Peer instance on unmount
    };
  }, []);

  const call = async (remotePeerId: string) => {
    setIsCalling(true); // Set calling state

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (my_video_ref.current) {
        my_video_ref.current.srcObject = mediaStream;
        my_video_ref.current.play();
        const call = peer_instance.current!.call(remotePeerId, mediaStream);

        call.on('stream', (remoteStream: MediaStream) => {
          if (remote_video_ref.current) {
            remote_video_ref.current.srcObject = remoteStream;
            remote_video_ref.current.play();
          }
        });

        call.on('close', () => {
          setIsCalling(false); // Reset calling state
        });
      }
    } catch (err) {
      console.log('Error in call(remotePeerId):', err);
      setIsCalling(false); // Reset calling state on error
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Live Video Attendance</h1>
      <p className={styles.subtitle}>Your Peer ID: <span className={styles.peerId}>{my_peer_id}</span></p>

      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <video ref={my_video_ref} className={styles.video} muted />
          <p className={styles.videoLabel}>Your Video</p>
        </div>
        <div className={styles.videoWrapper}>
          <video ref={remote_video_ref} className={styles.video} />
          <p className={styles.videoLabel}>Remote Video</p>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          value={remote_peer_id}
          onChange={(e) => set_remote_peer_id(e.target.value)}
          placeholder="Enter remote Peer ID"
          className={styles.input}
        />
        <button
          onClick={() => call(remote_peer_id)}
          disabled={isCalling || !remote_peer_id}
          className={styles.button}
        >
          {isCalling ? 'Calling...' : 'Call'}
        </button>
      </div>
    </div>
  );
}
