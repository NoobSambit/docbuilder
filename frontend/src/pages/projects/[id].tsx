import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SectionList from '@/components/SectionList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Sparkles, Calendar, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjectDetails() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState<any>(null);
    const [error, setError] = useState('');
    const [suggestTopic, setSuggestTopic] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const fetchProject = useCallback(async () => {
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch project');
            const data = await res.json();
            setProject(data);
        } catch (err: any) {
            setError(err.message);
        }
    }, [user, id]);

    useEffect(() => {
        if (user && id) {
            fetchProject();
        }
    }, [user, id, fetchProject]);

    const handleSuggestOutline = async () => {
        if (!suggestTopic) return;
        setIsSuggesting(true);
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/suggest-outline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ topic: suggestTopic })
            });
            if (!res.ok) throw new Error('Failed to suggest outline');
            await fetchProject(); // Refresh to show new outline
            setSuggestTopic('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleGenerateContent = async (sectionId: string) => {
        try {
            // Optimistic update
            setProject((prev: any) => ({
                ...prev,
                outline: prev.outline.map((s: any) =>
                    s.id === sectionId ? { ...s, status: 'generating' } : s
                )
            }));

            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ section_id: sectionId })
            });

            if (!res.ok) throw new Error('Failed to generate content');

            // Refresh to get full content
            await fetchProject();
        } catch (err: any) {
            setError(err.message);
            // Revert optimistic update (or just refresh)
            fetchProject();
        }
    };

    if (loading || !user || (!project && !error)) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    if (error) return (
        <div className="p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {project.owner_uid}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {(!project.outline || project.outline.length === 0) ? (
                        <Card className="p-12 text-center border-dashed">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-semibold">Start with an AI Outline</h3>
                                <p className="text-muted-foreground text-sm">
                                    Enter a topic below and let our AI generate a structured outline for your document.
                                </p>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. Market Analysis of EV Industry"
                                        value={suggestTopic}
                                        onChange={(e) => setSuggestTopic(e.target.value)}
                                    />
                                    <Button
                                        onClick={handleSuggestOutline}
                                        disabled={isSuggesting || !suggestTopic}
                                    >
                                        {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Suggest'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <SectionList
                            sections={project.outline}
                            onGenerate={handleGenerateContent}
                            onRefine={async (sectionId, prompt) => {
                                try {
                                    const token = await user?.getIdToken();
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/units/${sectionId}/refine`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ prompt, user_id: user.uid })
                                    });
                                    if (!res.ok) throw new Error('Refinement failed');
                                    await fetchProject();
                                } catch (err: any) {
                                    setError(err.message);
                                }
                            }}
                            onComment={async (sectionId, text) => {
                                try {
                                    const token = await user?.getIdToken();
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/units/${sectionId}/comments`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ text, user_id: user.uid })
                                    });
                                    if (!res.ok) throw new Error('Comment failed');
                                    await fetchProject();
                                } catch (err: any) {
                                    setError(err.message);
                                }
                            }}
                            onLikeRefinement={async (sectionId, rid) => {
                                try {
                                    const token = await user?.getIdToken();
                                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/units/${sectionId}/refinements/${rid}/like`, {
                                        method: 'POST',
                                        headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    await fetchProject();
                                } catch (err: any) { console.error(err); }
                            }}
                            onDislikeRefinement={async (sectionId, rid) => {
                                try {
                                    const token = await user?.getIdToken();
                                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/units/${sectionId}/refinements/${rid}/dislike`, {
                                        method: 'POST',
                                        headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    await fetchProject();
                                } catch (err: any) { console.error(err); }
                            }}
                            onRemove={() => { }}
                        />
                    )}
                </div>

                {/* Sidebar (Outline / Stats) */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-4">
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Document Structure</h3>
                        <div className="space-y-2">
                            {project.outline?.map((section: any, index: number) => (
                                <div key={section.id} className="flex items-center gap-2 text-sm p-2 rounded hover:bg-accent/50 cursor-pointer transition-colors">
                                    <span className="text-muted-foreground font-mono text-xs">{index + 1}.</span>
                                    <span className="truncate flex-1">{section.title}</span>
                                    <span className={cn("h-2 w-2 rounded-full",
                                        section.status === 'done' ? 'bg-green-500' :
                                            section.status === 'generating' ? 'bg-yellow-500' : 'bg-gray-300'
                                    )} />
                                </div>
                            ))}
                            {(!project.outline || project.outline.length === 0) && (
                                <p className="text-sm text-muted-foreground italic">No sections yet.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
