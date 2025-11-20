import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, FileText, Clock, MoreVertical } from 'lucide-react';

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

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchProjects = async () => {
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
            }
        };

        if (user) {
            fetchProjects();
        }
    }, [user]);

    if (loading || !user) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your documents and projects.</p>
                </div>
                <Link href="/projects/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </Link>
            </div>

            {fetchError && (
                <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
                    {fetchError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="block group">
                        <Card className="h-full hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="mt-4">{project.title}</CardTitle>
                                <CardDescription className="uppercase text-xs font-medium tracking-wider">
                                    {project.doc_type}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="text-xs text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                Updated {new Date(project.updated_at).toLocaleDateString()}
                            </CardFooter>
                        </Card>
                    </Link>
                ))}

                {projects.length === 0 && (
                    <Card className="col-span-full border-dashed p-12 flex flex-col items-center justify-center text-center bg-muted/50">
                        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No projects yet</h3>
                        <p className="text-muted-foreground mb-4 max-w-sm">
                            Get started by creating your first document project. AI will help you write it.
                        </p>
                        <Link href="/projects/new">
                            <Button variant="outline">Create Project</Button>
                        </Link>
                    </Card>
                )}
            </div>
        </div>
    );
}
