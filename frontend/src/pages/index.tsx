import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Brain, FileText, Download, Wand2, Search, RefreshCw, Check, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const features = [
        {
            icon: Brain,
            title: "AI-Powered Intelligence",
            desc: "Google Gemini 2.0 Flash with LangChain orchestration for smart, structured content generation"
        },
        {
            icon: Search,
            title: "Real-Time Web Research",
            desc: "RAG system searches the web and enhances content with current, factual information"
        },
        {
            icon: Wand2,
            title: "Context-Aware Refinement",
            desc: "AI understands your entire document and refines content with full context awareness"
        },
        {
            icon: Download,
            title: "Professional Export",
            desc: "Export to DOCX or PPTX with 4 custom themes and perfect formatting preservation"
        }
    ];

    const howItWorks = [
        {
            step: "1",
            icon: FileText,
            title: "Create Your Project",
            description: "Choose DOCX or PPTX, enter your topic, and let AI generate a professional outline with 5-8 sections",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            step: "2",
            icon: Brain,
            title: "Generate Content with AI",
            description: "Each section is generated with context awareness. Enable RAG for web-researched, fact-based content",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            step: "3",
            icon: RefreshCw,
            title: "Refine & Perfect",
            description: "Use natural language to refine content. AI remembers your document context and past refinements",
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            step: "4",
            icon: Download,
            title: "Export & Share",
            description: "Download as professional DOCX or beautiful PPTX with your choice of 4 themes",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        }
    ];

    const comparisons = [
        { feature: "Real-time web research", us: true, others: false },
        { feature: "Full document context awareness", us: true, others: false },
        { feature: "LangChain structured outputs", us: true, others: false },
        { feature: "Professional multi-theme export", us: true, others: false },
        { feature: "Refinement history with learning", us: true, others: false }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/10 selection:text-primary">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-50 border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-semibold tracking-tight flex items-center gap-2"
                >
                    <Sparkles className="h-5 w-5 text-primary" />
                    DocBuilder AI
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
                        <Button className="bg-foreground text-background hover:bg-foreground/90 shadow-sm">Get Started Free</Button>
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 md:py-28 text-center relative">
                {/* Background gradient */}
                <div className="absolute inset-0 -z-10 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                        <Zap className="h-4 w-4" />
                        <span>Powered by Google Gemini 2.0 Flash + RAG</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        AI Documents with <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Real Intelligence
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        The only AI document builder with <span className="font-semibold text-foreground">real-time web research</span>,
                        <span className="font-semibold text-foreground"> full context awareness</span>, and
                        <span className="font-semibold text-foreground"> intelligent refinement</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 w-full sm:w-auto group">
                                Start Building Free
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        "0 0 0 0px rgba(59, 130, 246, 0)",
                                        "0 0 0 8px rgba(59, 130, 246, 0.1)",
                                        "0 0 0 0px rgba(59, 130, 246, 0)"
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }}
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8 text-base w-full sm:w-auto border-2 border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary text-primary font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group relative overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Zap className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                                    <span className="relative">See How It Works</span>
                                    <motion.div
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="ml-2"
                                    >
                                        →
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Free forever plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Export unlimited documents</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="container mx-auto px-6 py-24 border-t border-border/40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">How It Works</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From idea to professional document in 4 simple steps
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {howItWorks.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative group"
                        >
                            {/* Connecting line */}
                            {i < howItWorks.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -translate-x-8" />
                            )}

                            <div className="text-center space-y-4">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bgColor} ${step.color} mb-2`}>
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${step.bgColor} ${step.color}`}>
                                    Step {step.step}
                                </div>
                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Visual Demo Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="rounded-2xl border border-border/40 bg-card shadow-2xl overflow-hidden">
                        <div className="bg-muted/30 p-4 border-b border-border/40 flex items-center gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">AI Document Builder</span>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                                    <Brain className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium mb-2">AI Generated Outline</div>
                                    <div className="space-y-2">
                                        {["Introduction to Electric Vehicles", "Market Analysis 2024", "Key Trends & Innovations"].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                                    <Search className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium mb-2">RAG Web Research</div>
                                    <div className="text-xs text-muted-foreground">
                                        Retrieved 5 sources from IEA, Bloomberg, Reuters with latest market data...
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500 shrink-0">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium mb-2">Generated Content</div>
                                    <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/40">
                                        According to the International Energy Agency&apos;s October 2024 report, global EV market share reached 18% in 2024, driven by strong growth in China and Europe...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Key Features Grid */}
            <section className="container mx-auto px-6 py-24 border-t border-border/40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Why DocBuilder AI?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Advanced AI technology that goes beyond simple text generation
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-6 rounded-2xl border border-border/40 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="container mx-auto px-6 py-24 border-t border-border/40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">DocBuilder vs Others</h2>
                        <p className="text-muted-foreground">See what makes us different</p>
                    </div>

                    <div className="rounded-2xl border border-border/40 overflow-hidden bg-card">
                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 border-b border-border/40 font-semibold text-sm">
                            <div>Feature</div>
                            <div className="text-center">DocBuilder AI</div>
                            <div className="text-center text-muted-foreground">Others</div>
                        </div>
                        {comparisons.map((comp, i) => (
                            <div key={i} className="grid grid-cols-3 gap-4 p-4 border-b border-border/40 last:border-b-0 text-sm">
                                <div className="text-muted-foreground">{comp.feature}</div>
                                <div className="flex justify-center">
                                    {comp.us ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    {comp.others ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-24 border-t border-border/40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl p-12 md:p-20 text-center overflow-hidden"
                >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 -z-10" />
                    <div className="absolute inset-0 bg-grid-white/5 -z-10" />

                    <div className="max-w-2xl mx-auto relative">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            Ready to create smarter documents?
                        </h2>
                        <p className="text-muted-foreground text-lg mb-10">
                            Join professionals who are already creating better documents with AI-powered intelligence.
                        </p>
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-10 text-lg bg-foreground text-background hover:bg-foreground/90 group">
                                Get Started Free
                                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-6">
                            No credit card required • Free forever plan • Export unlimited documents
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-background">
                <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                        <Sparkles className="h-5 w-5 text-primary" />
                        DocBuilder AI
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Powered by Google Gemini 2.0 Flash • &copy; 2024 DocBuilder AI. All rights reserved.
                    </p>
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
