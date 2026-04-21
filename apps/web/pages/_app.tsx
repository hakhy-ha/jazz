import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function JazzApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Jazz Social App</title>
        <meta
          name="description"
          content="Jazz is a modern social chat app for communities, follow updates, comments, and real-time conversations."
        />
        <meta
          name="keywords"
          content="Jazz social app, chat community, Firebase auth, real-time messaging, social network, follow friends, comments, notifications"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Jazz Social App" />
        <meta
          property="og:description"
          content="Join Jazz for fast, private social chat and community connections with modern messaging features."
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default JazzApp;
