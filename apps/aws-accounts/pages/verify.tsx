import { FormEvent, useCallback, useState } from 'react';
import styles from './verify.module.css';
import { httpClient } from '@iyio/common';

export function Verify() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    const submit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !code) {
            return;
        }

        const params: ImportCommand = {
            method: 'verify',
            email: email,
            code: code
        }

        const response = await httpClient().postAsync("https://z27w3zbhjkbfqzyuasc2bre7f40pjneb.lambda-url.us-east-1.on.aws/", params);

        console.log(response);
    }, [email, code]);

    return (
        <form onSubmit={submit}>
            <div className={styles.container}>
                <div className={styles.box}>
                    <div className={styles.flexColumn}>
                        <h1 className={styles.center}>Verify</h1>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <label className={styles.label}>Verification Code</label>
                        <input
                            className={styles.input}
                            type="number"
                            onChange={(e) => setCode(e.target.value)}
                            value={code}
                        />
                    </div>
                    <div className={styles.flexColumnEnd}>
                    <button className={styles.btn} type='submit'>Verify</button>
                </div>
                </div>          
            </div>
        </form>
    );
}

interface ImportCommand {
    method: Method;
    email: string;
    code: string;
}

declare type Method = 'verify';

export default Verify;