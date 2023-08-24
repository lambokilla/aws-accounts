import { useState } from 'react';
import styles from './index.module.css';
import Link from 'next/link';

export function Index() {
    const [user, setUser] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>({});

    return (
        <div className={styles.container}>
            {user &&
                <div className={styles.box}>
                    <h1>Welcome, {userProfile.firstName}</h1>
                </div>
            }
            {!user &&
                <div className={styles.box}>
                    <div className={styles.flexColumn}>
                        <h1 className={styles.center}>Welcome</h1>
                    </div>
                    <div className={styles.flexColumnEnd}>
                        <Link href="/sign-in" className={styles.flexStretch} style={{textDecoration: 'none'}}>
                            <button className={styles.btn}>Sign In</button>
                        </Link>
                        <Link href="/register" className={styles.flexStretch} style={{textDecoration: 'none'}}>
                            <button className={styles.btn}>Register</button>
                        </Link>
                    </div>
                </div>
            }
            
        </div>
    );
}

export default Index;

interface UserProfile {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: number;
}
