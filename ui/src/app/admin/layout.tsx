// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import styles  from "./admin.module.css";
import SideMenu from './../../component/sideMenu.js';
import  Link  from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className= { styles.all }>
          <div className ={ styles.sidemenu }>
              <SideMenu />
          </div>
          
          <div className = { styles.content }>
              <div className = { styles.header }>
                  <h1> Admin page </h1>
              </div>
              <div>
                  {children}
              </div>
              <div className = {styles.controls}>
                <Link href="/admin">
                    Back to admin
                </Link>
                <Link href="/">
                    back
                </Link>
              </div>
          </div>
      </div>

  );
}
