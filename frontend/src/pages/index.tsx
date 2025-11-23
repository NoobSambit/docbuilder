import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, Shield, LayoutTemplate, FileText, Globe, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/10 selection:text-primary">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-50 border-b border-border/40">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-semibold tracking-tight"
                >
                    DocBuilder
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-x-4"
                >
                    <Link href="/login">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-foreground text-background hover:bg-foreground/90 shadow-sm">Get Started</Button>
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-24 md:py-32 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-foreground">
                        Create documents <br />
                        <span className="text-muted-foreground">at the speed of thought.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                        The most advanced AI-powered document authoring platform.
                        Generate, edit, and export professional documents in seconds.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 w-full sm:w-auto">
                                Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                                View Demo
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Image / Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="rounded-xl border border-border/40 bg-card shadow-2xl overflow-hidden">
                        <div className="aspect-video flex items-center justify-center bg-muted/5">
                            <div className="text-center p-8">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground font-medium">Interactive Editor Preview</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section id="features" className="container mx-auto px-6 py-24 border-t border-border/40">
                <div className="grid md:grid-cols-3 gap-12">
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
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-24 border-t border-border/40">
                <div className="bg-muted/30 rounded-3xl p-12 md:p-20 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to transform your workflow?</h2>
                        <p className="text-muted-foreground text-lg mb-10">
                            Join thousands of teams who are already building better documents with DocBuilder.
                        </p>
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-10 text-base bg-foreground text-background hover:bg-foreground/90">
                                Get Started for Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-background">
                <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-lg font-semibold tracking-tight">
                        DocBuilder
                    </div>
                    <p className="text-muted-foreground text-sm">&copy; 2024 DocBuilder. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
