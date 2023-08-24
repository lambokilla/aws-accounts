import styles from './appointment.module.css';

export function Appointment() {

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h1 className={styles.center}>Pick your time</h1>
                <div className={styles.flexRow}>
                    <label className={styles.label}>Service</label>
                    <select className={styles.selector}>
                        <option>cut</option>
                    </select>
                
                </div>
            </div>
            
        </div>
    );
}

export default Appointment;
