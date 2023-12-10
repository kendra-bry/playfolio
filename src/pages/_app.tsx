import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Open_Sans } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const font = Open_Sans({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={font.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
