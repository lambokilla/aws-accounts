import Link from 'next/link';
import styles from './Navbar.module.css';
import { Nunito } from '@next/font/google';
import Image from 'next/image';
import { useState } from 'react';

const nunito = Nunito({subsets: ['latin']});

export default function Navbar() {
    const [hover, setHover] = useState(false);
    const [user, setUser] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        firstName: "Ben"
    });

    const handleDropDownOnMouseEnter = () => {
        setHover(true);
    }

    const handleDropDownOnMouseLeave = () => {
        setHover(false);
    }

    return (
        <header style={ nunito.style } className={styles.mainHeader}>
            <nav className={styles.mainNav}>
                <Link href="/" style={{textDecoration: 'none'}}>
                    <p className={styles.mainNavLink}>Home</p>
                </Link>
                <ul className={styles.mainNavItems}>
                    <li className={styles.mainNavItem}>
                        <div className={styles.mainNavDropDown} 
                            onMouseEnter={handleDropDownOnMouseEnter}
                            onMouseLeave={handleDropDownOnMouseLeave}
                        >
                            <div className={styles.mainNavDropDownTitle}>
                                <p className={styles.mainNavDropDownTitleText}>Account</p>
                                <Image
                                    style={{
                                        transition: ".75s",
                                        transform: hover ? "rotate(180deg)" : "rotate(0deg)"
                                    }}
                                    className={styles.downArrow}
                                    src="/down-arrow.svg"
                                    height={25}
                                    width={25}
                                    alt="drop menu down"
                                />
                            </div>
                            {user &&
                                <div className={styles.mainNavDropDownContent}>
                                    <p className={styles.mainNavDropDownText}>Hello, {userProfile.firstName}</p>
                                    <Link href="/profile" style={{textDecoration: 'none'}}>
                                        <p className={styles.mainNavDropDownText}>Profile</p>
                                    </Link>
                                    <button className={styles.btnSignOut}>Sign Out</button>
                                </div>
                            }
                            {!user &&
                                <div className={styles.mainNavDropDownContent}>
                                    <Link href="/sign-in" style={{textDecoration: 'none'}}>
                                        <p className={styles.mainNavDropDownText}>Sign In</p>
                                    </Link>
                                </div>
                            }
                            
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

interface UserProfile {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: number;
}