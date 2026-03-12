import { List } from "./List";
import styles from "./Tour.module.css";

export function Tour() {
    return (
        <section className={styles.tour} data-header="dark">
            <div className={styles.container}>
            <img className={styles.image} src="/images/mlb.webp"></img>
            <div className={styles.list}>
                <List />
            </div>
            </div>
        </section>
    );
}