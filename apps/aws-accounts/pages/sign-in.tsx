import { FormEvent, useCallback, useState } from 'react';
import styles from './sign-in.module.css';
import { useRouter } from 'next/router';
import { authService } from '@iyio/common';

export function SignIn() {
    const [user, setUser] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router=useRouter();

    const submit = useCallback(async(e: FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        try {
            const user = await authService().signInEmailPasswordAsync(email, password);

            if (user.success) {
                router.push('/');
            } else if (user.success === false) {
                throw new Error(user.message);
            }
        } catch (err) {
            console.error(err);
        }

    }, [email, password, router]);

    return (
        <form onSubmit={submit}>
            <div className={styles.container}>
                <div className={styles.box}>
                    <div className={styles.flexColumn}>
                        <h1 className={styles.center}>Sign In</h1>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <label className={styles.label}>Password</label>
                        <input
                            className={styles.input}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <div className={styles.flexColumnEnd}>
                        <button className={styles.btn} type='submit'>Sign In</button>
                    </div>
                    
                </div>
                
            </div>
        </form>
    );
}

export default SignIn;