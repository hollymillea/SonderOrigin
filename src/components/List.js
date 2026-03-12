import styles from './List.module.css';

export function List() {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <ListRow date="MAR 2, MON" venue="Trinity Centre @ 7PM" city="Bristol, United Kingdom" />
        <ListRow date="MAR 4, WEDS" venue="O2 Shepherd's Bush Empire @ 7PM" city="London, United Kingdom" />
        <ListRow date="MAR 7, SAT" venue="RNCM (Royal Northern College of Music) @ 7:00 PM " city="Manchester, United Kingdom" />
        <ListRow date="MAR 8, SUN" venue="St Luke's @ 7PM" city="Glasgow, United Kingdom" />
        <ListRow date="MAR 10, TUES" venue="Vicar Street @ 7PM" city="Dublin, Ireland" />
      </ul>
    </div>
  );
}

function ListRow({ date, venue, city }) {
  return (
    <li className={styles.row}>
      <span>{date}</span>
      <span>{venue}</span>
      <span>{city}</span>
      <div className={styles.actions}>
        <button className={styles.button}>Tickets</button>
        <button className={styles.button}>RSVP</button>
      </div>
    </li>
  );
}