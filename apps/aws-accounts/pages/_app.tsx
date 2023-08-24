import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import Navbar from '../components/Navbar';
import { Nunito } from '@next/font/google';

const nunito = Nunito({subsets: ['latin']});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <Navbar />
      <main className={nunito.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
