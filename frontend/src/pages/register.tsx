import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Mail, Lock, ArrowLeft, Sparkles, FileText, Zap, User } from 'lucide-react';
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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Sparkles, title: "AI Generation", desc: "Draft documents in seconds" },
        { icon: FileText, title: "Smart Formatting", desc: "Professional layouts automatically" },
        { icon: Zap, title: "Instant Export", desc: "Download as Word or PDF" },
    ];

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Visual (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-muted relative items-center justify-center border-r border-border overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="relative z-10 p-12 max-w-lg w-full">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold mb-4 text-foreground tracking-tight">Join the Revolution</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Experience the future of document creation.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm">
                                <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
                        <p className="text-muted-foreground mt-2">
                            Enter your email below to create your account
                        </p>
                    </div>

                    {/* Mobile Features (Visible only on small screens) */}
                    <div className="lg:hidden grid grid-cols-3 gap-2 mb-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center p-2 rounded-md bg-muted/30 border border-border/40">
                                <feature.icon className="h-5 w-5 text-primary mb-1" />
                                <span className="text-xs font-medium text-foreground leading-tight">{feature.title}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        {error && (
                            <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none ml-1">
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
                                        className="h-11 pl-10"
                                    />
                                </div>
                            </div>

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
                                <label className="text-sm font-medium leading-none ml-1">
                                    Password
                                </label>
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-11 pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href="/login" className="font-medium text-foreground hover:underline">
                            Sign in
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

