import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, FileText, Clock, MoreVertical, Search, Filter, Trash2, Edit2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
    id: string;
    title: string;
    doc_type: string;
    updated_at: string;
}

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetchError, setFetchError] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoadingProjects(true);
            try {
                const token = await user?.getIdToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch projects');
                const data = await res.json();
                setProjects(data);
            } catch (err: any) {
                setFetchError(err.message);
            } finally {
                setLoadingProjects(false);
            }
        };

        if (user) {
            fetchProjects();
        }
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        if (openMenuId) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openMenuId]);

    const handleDeleteProject = async (projectId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        setDeletingId(projectId);
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to delete project');

            // Remove from local state
            setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
            setOpenMenuId(null);
        } catch (err: any) {
            alert(`Error deleting project: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    const handleRenameProject = async (projectId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        setRenamingId(projectId);
        setNewTitle(project.title);
        setOpenMenuId(null);
    };

    const submitRename = async (projectId: string) => {
        if (!newTitle.trim()) {
            setRenamingId(null);
            return;
        }

        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/rename`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle.trim() })
            });

            if (!res.ok) throw new Error('Failed to rename project');

            const updatedProject = await res.json();

            // Update local state
            setProjects(prevProjects => prevProjects.map(p =>
                p.id === projectId ? { ...p, title: updatedProject.title, updated_at: updatedProject.updated_at } : p
            ));

            setRenamingId(null);
            setNewTitle('');
        } catch (err: any) {
            alert(`Error renaming project: ${err.message}`);
        }
    };

    const cancelRename = () => {
        setRenamingId(null);
        setNewTitle('');
    };

    if (loading || !user) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your documents and projects.</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link href="/projects/new">
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                            <Plus className="mr-2 h-4 w-4" /> New Project
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Search and Filters Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-4"
            >
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>
                <Button variant="outline" size="icon" className="rounded-md">
                    <Filter className="h-4 w-4" />
                </Button>
            </motion.div>

            {fetchError && (
                <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                    {fetchError}
                </div>
            )}

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {loadingProjects ? (
                    // Loading skeleton
                    [1, 2, 3].map((i) => (
                        <motion.div key={i} variants={item}>
                            <Card className="h-full border border-border bg-card">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-muted rounded-md text-foreground inline-block animate-pulse">
                                            <div className="h-5 w-5 bg-muted-foreground/20 rounded" />
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
                                        <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                                    </div>
                                </CardHeader>
                                <CardFooter className="border-t border-border pt-4">
                                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                ) : projects.length > 0 ? (
                    projects.map((project) => (
                        <motion.div key={project.id} variants={item}>
                            <Card className="h-full border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 group">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Link href={`/projects/${project.id}`} className="flex-1">
                                            <div className="p-2 bg-muted rounded-md text-foreground inline-block">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                        </Link>
                                        <div className="relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === project.id ? null : project.id);
                                                }}
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                            {openMenuId === project.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                                                    <button
                                                        onClick={(e) => handleRenameProject(project.id, e)}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        Rename Project
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteProject(project.id, e)}
                                                        disabled={deletingId === project.id}
                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive hover:text-destructive/90 transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        {deletingId === project.id ? 'Deleting...' : 'Delete Project'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {renamingId === project.id ? (
                                        <div className="mt-4 space-y-2" onClick={(e) => e.preventDefault()}>
                                            <Input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') submitRename(project.id);
                                                    if (e.key === 'Escape') cancelRename();
                                                }}
                                                autoFocus
                                                className="text-lg font-semibold"
                                            />
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => submitRename(project.id)}>
                                                    Save
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={cancelRename}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href={`/projects/${project.id}`}>
                                            <CardTitle className="mt-4 text-lg font-semibold hover:text-primary transition-colors">{project.title}</CardTitle>
                                            <CardDescription className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
                                                {project.doc_type}
                                            </CardDescription>
                                        </Link>
                                    )}
                                </CardHeader>
                                <Link href={`/projects/${project.id}`}>
                                    <CardFooter className="text-xs text-muted-foreground flex items-center gap-2 border-t border-border pt-4 mt-auto">
                                        <Clock className="h-3 w-3" />
                                        Updated {new Date(project.updated_at).toLocaleDateString()}
                                    </CardFooter>
                                </Link>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <motion.div variants={item} className="col-span-full">
                        <div className="border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center bg-muted/5">
                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Get started by creating your first document project.
                            </p>
                            <Link href="/projects/new">
                                <Button variant="outline">
                                    <Plus className="mr-2 h-4 w-4" /> Create First Project
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
