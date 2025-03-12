// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Link from 'next/link';
import styles from './admin.module.css';

export default function Home() {
   return (
       <>
           <p>
               admin routes here:
                   make admin routes to seed database : 
                   /admin/create_institution DONE
                   /admin/create_instructor : select instution
                   /admin/create_student : select institution
                   /admin/create_course : select institution , instructor
           </p>
       </>
   )
}
