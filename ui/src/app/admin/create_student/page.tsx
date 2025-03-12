
import Link from 'next/link';
import styles from './create_student.module.css';

import TakePicture from '@/component/take_picture';

export default function Home() {
   return (
       <>
           <div className={styles.form}>
               <h2>
                    Create a student
               </h2>
               <label>
               Select an institution:
                   <select>
                        <option> inst 1 </option>
                        <option> inst 2 </option>
                        <option> inst 3 </option>
                        <option> inst 4 </option>
                    </select>
               </label>
               <label>
               First name:
                   <input type = "text" placeholder="First name"/>
               </label>
               <label>
               Last name:
                   <input type = "text" placeholder="Last name"/>
               </label>
               <label>
                    Picture:
                        <TakePicture />
               </label>
               <button> Create </button>
           </div>
           <Link href="/admin">
                back
           </Link>
       </>
   )
}
