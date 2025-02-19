import styles  from "./admin.module.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className= { styles.all }>
          <div className = { styles.header }>
              <h1> Admin </h1>
          </div>
          <div className = { styles.content }>
          {children}
          </div>
      </div>

  );
}
