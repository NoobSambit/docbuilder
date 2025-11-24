import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, ArrowLeft, Mail, Lock, Sparkles, Brain, Search, Wand2, Check } from 'lucide-react';
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

    const features = [
        { icon: Brain, title: "AI-Powered Generation", desc: "Create professional documents with Google Gemini 2.0 Flash" },
        { icon: Search, title: "Web Research (RAG)", desc: "Real-time web search enhances content with current data" },
        { icon: Wand2, title: "Context-Aware", desc: "AI remembers your entire document for smart refinements" },
    ];

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center border-r border-border overflow-hidden bg-muted/30">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
                <div className="absolute inset-0 bg-grid-white/5" />

                <div className="relative z-10 p-12 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="h-8 w-8 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">DocBuilder AI</h2>
                        </div>
                        <h1 className="text-4xl font-bold mb-6 text-foreground tracking-tight">Welcome Back</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                            Continue building intelligent documents with AI-powered tools.
                        </p>

                        <div className="space-y-4">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Powered by Google Gemini 2.0 Flash + RAG</span>
                        </div>
                    </motion.div>
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
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">DocBuilder AI</span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
                        <p className="text-muted-foreground mt-2">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 flex items-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none ml-1 text-foreground">
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
                                        className="h-11 pl-10 bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium leading-none text-foreground">
                                        Password
                                    </label>
                                    <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
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
                                        className="h-11 pl-10 bg-background"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base bg-foreground text-background hover:bg-foreground/90 transition-colors"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don&apos;t have an account? </span>
                        <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Create an account
                        </Link>
                    </div>

                    {/* Mobile features */}
                    <div className="lg:hidden pt-6 border-t border-border/40">
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: Brain, label: "AI Generation" },
                                { icon: Search, label: "Web Research" },
                                { icon: Wand2, label: "Smart Refine" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30 border border-border/40">
                                    <item.icon className="h-5 w-5 text-primary mb-2" />
                                    <span className="text-xs font-medium text-foreground leading-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
