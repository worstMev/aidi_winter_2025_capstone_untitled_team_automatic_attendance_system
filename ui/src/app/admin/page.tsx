import Link from 'next/link';
import styles from './admin.module.css';

export default function Home() {
   return (
       <>
           <p>
               admin routes here:
                   make admin routes to seed database : 
                   /admin/create_institution
                   /admin/create_instructor : select instution
                   /admin/create_student : select institution
                   /admin/create_course : select institution , instructor
           </p>
           <Link href="/admin/create_student">
                create a student
           </Link>
           <Link href="/">
                back
           </Link>
       </>
   )
}
