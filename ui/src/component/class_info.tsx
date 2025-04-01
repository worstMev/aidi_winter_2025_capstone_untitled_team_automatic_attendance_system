// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect , useState } from 'react';
import { fetchClassInfo } from '@/fetchData';

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

    return (
        <p> {class_name} </p>
    );
}
