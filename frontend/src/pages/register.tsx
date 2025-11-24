import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Mail, Lock, ArrowLeft, Sparkles, FileText, Zap, User, Brain, Search, Wand2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (!displayName.trim()) {
            setError("Display name is required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name in Firebase Auth profile
            await updateProfile(userCredential.user, {
                displayName: displayName.trim()
            });

            // Save display name to Firestore
            const token = await userCredential.user.getIdToken();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/save-profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            router.push('/dashboard');
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Email already in use. Please use a different email or login.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Brain,
            title: "AI Outline Generation",
            desc: "Instantly create professional document structures with 5-8 intelligent sections"
        },
        {
            icon: Search,
            title: "Real-Time Web Research",
            desc: "RAG system fetches current data from the web to enhance your content"
        },
        {
            icon: Wand2,
            title: "Context-Aware Refinement",
            desc: "AI understands your entire document for smart, contextual improvements"
        },
        {
            icon: Download,
            title: "Professional Export",
            desc: "Export to DOCX or PPTX with 4 custom themes and perfect formatting"
        }
    ];

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Visual (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center border-r border-border overflow-hidden bg-muted/30">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
                <div className="absolute inset-0 bg-grid-white/5" />

                <div className="relative z-10 p-12 max-w-lg w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="h-8 w-8 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">DocBuilder AI</h2>
                        </div>
                        <div className="mb-10">
                            <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">
                                Create Smarter Documents
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Join professionals using AI to create better documents 10x faster
                            </p>
                        </div>

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

                        <div className="mt-10 p-4 rounded-xl bg-primary/5 border border-primary/20">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">Powered by:</span> Google Gemini 2.0 Flash • LangChain • RAG System
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
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

                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
                        <p className="text-muted-foreground mt-2">
                            Start building intelligent documents in seconds
                        </p>
                    </div>

                    {/* Mobile Features (Visible only on small screens) */}
                    <div className="lg:hidden grid grid-cols-2 gap-2 p-4 rounded-xl bg-muted/30 border border-border/40">
                        {[
                            { icon: Brain, label: "AI Generation" },
                            { icon: Search, label: "Web Research" },
                            { icon: Wand2, label: "Smart Refine" },
                            { icon: Download, label: "Export" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-center p-2">
                                <item.icon className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-xs font-medium text-foreground">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
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
                                    Display Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required
                                        className="h-11 pl-10 bg-background"
                                    />
                                </div>
                            </div>

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
                                <label className="text-sm font-medium leading-none ml-1 text-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Min. 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pl-10 bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none ml-1 text-foreground">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-11 pl-10 bg-background"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base bg-foreground text-background hover:bg-foreground/90 transition-colors group"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Creating account...' : 'Create Account'}
                            {!loading && <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center px-4">
                            By creating an account, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
