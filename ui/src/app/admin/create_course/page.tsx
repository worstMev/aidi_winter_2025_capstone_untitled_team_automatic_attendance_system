
import Link from 'next/link';
import styles from './create_course.module.css';

export default function Home() {
   return (
       <>
           <div className={styles.form}>
               <h2>
                    Create a course
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
               Select an institructor:
                   <select>
                        <option> instr 1 </option>
                        <option> instr 2 </option>
                        <option> instr 3 </option>
                        <option> instr 4 </option>
                    </select>
               </label>
               <label>
               Course name:
                   <input type = "text" placeholder="enter the name of the course"/>
               </label>
               <label>
               Enroll students: link ?
               </label>
               <button> Create </button>
           </div>
           <Link href="/admin">
                back
           </Link>
       </>
   )
}
