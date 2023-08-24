import { useCallback, useState } from 'react';
import { httpClient } from '@iyio/common';
import styles from './register.module.css';
import { User, registrationFuncUrlParam } from '@aws-accounts/common';

export function Register() {
    const [user, setUser] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    const register = useCallback(async () => {

        if (!email || !password || !confirmPassword) {
            return;
        }

        if (password !== confirmPassword) {
            return;
        }

        const params: ImportCommand = {
            method: 'register',
            email: email,
            password: password,
            userData: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                id: "some id"
            }
        }

        console.log(params);

        const response = await httpClient().postAsync("https://z27w3zbhjkbfqzyuasc2bre7f40pjneb.lambda-url.us-east-1.on.aws/", params);

        console.log(response);
    }, [confirmPassword, email, firstName, lastName, password, phone]);

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.flexColumn}>
                    <h1 className={styles.center}>Register</h1>
                    <label className={styles.label}>First Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                    />
                    <label className={styles.label}>Last Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                    />
                    <label className={styles.label}>Phone Number</label>
                    <input
                        className={styles.input}
                        type="tel"
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                    />
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
                    <label className={styles.label}>Confirm Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                </div>
                <div className={styles.flexColumnEnd}>
                    <button className={styles.btn} onClick={register}>Register</button>
                </div>
                
            </div>
            
        </div>
    );
}

interface ImportCommand {
    method: Method;
    email: string;
    password?: string;
    code?: string;
    userData?: User;
}

declare type Method = 'register' | 'verify' | 'registerAdmin';

export default Register;