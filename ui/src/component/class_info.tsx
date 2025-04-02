// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect , useState } from 'react';
import { fetchClassInfo } from '@/fetchData';
import styles from './class_info.module.css';


export default function ClassInfo (props) {
    const { class_id } = props;

    const [ class_name , set_class_name ] = useState(' ');

    useEffect(() => {
        console.log('class_id dependant effect, class_id ', class_id);
        //get data
        const fetchDataClass = async (class_id) => {
            //TODO
            const data = await fetchClassInfo(class_id);
            console.log('get classes for  class_id data', class_id,data)
            set_class_name(`${data[0]} : ${data[3]} at ${data[1]} `);
        }
        fetchDataClass(class_id);

    },[class_id,class_name]);

    const copyAttLink = async () => {
        console.log('copyAttLink into clipboard');
        const link = `${window.location.origin}/test_attendance?class_id=${class_id}`
        console.log('link ',link)
        const clipboardItem = new ClipboardItem({
            'text/plain' : link
        });
        await navigator.clipboard.write([clipboardItem])
        alert('Link for attendance copied into clipboard!')
    }

    const copyAttLinkExt = async () => {
        console.log('copyAttLink into clipboard');
        const link = `${window.location.origin}/test_ext_feed?class_id=${class_id}`
        console.log('link ',link)
        const clipboardItem = new ClipboardItem({
            'text/plain' : link
        });
        await navigator.clipboard.write([clipboardItem])
        alert('Link for attendance copied into clipboard!')
    }

    return (
        <div className={styles.class_info}>
            <p> {class_name} </p>
            <button onClick= {copyAttLink}>
                Copy attendance link
            </button>
            <button onClick= {copyAttLinkExt}>
                Copy attendance link for external feed
            </button>
        </div>
    );
}
