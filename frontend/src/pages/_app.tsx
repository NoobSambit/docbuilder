import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isAuthPage = ['/login', '/register', '/'].includes(router.pathname);

    return (
        <AuthProvider>
            <div className={`${inter.variable} ${jakarta.variable} font-sans`}>
                {isAuthPage ? (
                    <Component {...pageProps} />
                ) : (
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                )}
            </div>
        </AuthProvider>
    );
}
