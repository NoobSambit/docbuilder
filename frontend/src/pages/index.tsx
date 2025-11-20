import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, Zap, Shield, LayoutTemplate } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    DocBuilder
                </div>
                <div className="space-x-4">
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 md:py-32 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10 opacity-50" />

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-up">
                    Create Documents <br />
                    <span className="text-primary">at the Speed of Thought</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    The most advanced AI-powered document authoring platform.
                    Generate, edit, and export professional documents in seconds.
                </p>
                <div className="flex justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <Link href="/register">
                        <Button size="lg" className="h-12 px-8 text-lg">
                            Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                            View Demo
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Zap,
                            title: "Lightning Fast",
                            desc: "Optimized for performance. No lag, just smooth writing experience."
                        },
                        {
                            icon: LayoutTemplate,
                            title: "Smart Templates",
                            desc: "Choose from hundreds of professionally designed templates."
                        },
                        {
                            icon: Shield,
                            title: "Enterprise Secure",
                            desc: "Bank-grade encryption keeps your documents safe and private."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Proof / Footer */}
            <footer className="border-t bg-muted/30">
                <div className="container mx-auto px-6 py-12 text-center text-muted-foreground">
                    <p>&copy; 2024 DocBuilder. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
