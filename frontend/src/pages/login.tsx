import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, ArrowLeft, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-muted relative items-center justify-center border-r border-border">
                <div className="relative z-10 p-12 max-w-lg">
                    <h2 className="text-4xl font-bold mb-6 text-foreground tracking-tight">Welcome Back</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Continue building your masterpiece. Your documents are waiting for you.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
                        <p className="text-muted-foreground mt-2">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none ml-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium leading-none">
                                        Password
                                    </label>
                                    <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don&apos;t have an account? </span>
                        <Link href="/register" className="font-medium text-foreground hover:underline">
                            Create an account
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
