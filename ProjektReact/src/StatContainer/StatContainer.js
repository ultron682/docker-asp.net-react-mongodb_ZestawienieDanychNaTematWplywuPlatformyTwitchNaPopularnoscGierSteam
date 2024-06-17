import styles from './StatContainer.module.css';
const StatContainer = ({title, value, color}) => {
    return (
        <div className={styles.statContainer}>
            <div className={styles.statTitle}>{title}</div>
            <div className={styles.statValue} style={{backgroundColor: color}}>{value}</div>
        </div>
    );
}

export default StatContainer;