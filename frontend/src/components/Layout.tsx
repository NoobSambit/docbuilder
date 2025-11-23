import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { Button } from './ui/Button';
import { LogOut, LayoutDashboard, FileText, Menu, X, Sun, Moon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/projects/new', label: 'New Project', icon: FileText },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const sidebarVariants = {
        open: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
        closed: { x: "-100%", opacity: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">DocBuilder</span>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Sidebar */}
            {showSidebar && user && (
                <>
                    {/* Mobile Overlay */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            />
                        )}
                    </AnimatePresence>

                    {/* Desktop Sidebar - Sticky */}
                    <aside className="hidden md:flex md:flex-col md:w-72 md:bg-card md:border-r md:border-border md:sticky md:top-0 md:h-screen md:overflow-y-auto">
                        <div className="p-6 flex flex-col h-full">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight leading-tight">
                                    DocBuilder
                                </h1>
                            </div>

                            <nav className="space-y-2 flex-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = router.pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.02, x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                                                {item.label}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="pt-6 pb-2 border-t border-border space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme</span>
                                    {mounted && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                            className="rounded-full hover:bg-accent"
                                        >
                                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                        {(user.displayName || user.email)?.[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate text-foreground">{user.displayName || user.email}</p>
                                        <p className="text-xs text-muted-foreground">Pro Plan</p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Sidebar - Animated Drawer */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.aside
                                initial={{ x: "-100%", opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: "-100%", opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col h-screen shadow-2xl md:hidden"
                            >
                                <div className="p-6 flex flex-col h-full overflow-y-auto">
                                    <div className="mb-8">
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight leading-tight">
                                            DocBuilder
                                        </h1>
                                    </div>

                                    <nav className="space-y-2 flex-1">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = router.pathname === item.href;
                                            return (
                                                <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                                                    <motion.div
                                                        whileHover={{ scale: 1.02, x: 4 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                                                            isActive
                                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                        )}
                                                    >
                                                        <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                                                        {item.label}
                                                    </motion.div>
                                                </Link>
                                            );
                                        })}
                                    </nav>

                                    <div className="pt-6 pb-2 border-t border-border space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme</span>
                                            {mounted && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                                    className="rounded-full hover:bg-accent"
                                                >
                                                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                                </Button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                                {(user.displayName || user.email)?.[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-medium truncate text-foreground">{user.displayName || user.email}</p>
                                                <p className="text-xs text-muted-foreground">Pro Plan</p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 relative min-h-screen">
                {/* Background Gradients */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px]" />
                </div>

                <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
