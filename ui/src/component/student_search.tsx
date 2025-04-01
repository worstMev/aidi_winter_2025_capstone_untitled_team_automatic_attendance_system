// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { useEffect , useState } from 'react';

export default function StudentSearch(props) {
    const { class_id } = props;
    return(
        <div>
            <p> Search student from class {class_id} </p>
        </div>
    )
}
