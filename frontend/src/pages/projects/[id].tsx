import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SectionList from '@/components/SectionList';
import { ExportDialog } from '@/components/ExportDialog';
import AddSectionDialog from '@/components/AddSectionDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Sparkles, Calendar, User, Loader2, Download, Plus, Edit, ChevronUp, ChevronDown, Trash2, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjectDetails() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState<any>(null);
    const [error, setError] = useState('');
    const [suggestTopic, setSuggestTopic] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState<{ id: string; title: string } | null>(null);
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [isDeletingSection, setIsDeletingSection] = useState(false);
    const [showAIInput, setShowAIInput] = useState(false);
    const [showManualAdd, setShowManualAdd] = useState(false);
    const [isMobileOutlineOpen, setIsMobileOutlineOpen] = useState(false);

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
            setShowAIInput(false); // Close the AI input after successful generation
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleExport = async (format: 'docx' | 'pptx', theme?: string) => {
        try {
            console.log('[EXPORT] Starting export, format:', format, 'theme:', theme);
            const token = await user?.getIdToken();
            let url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/export?format=${format}`;
            if (theme && format === 'pptx') {
                url += `&theme=${theme}`;
            }
            console.log('[EXPORT] Fetching from URL:', url);

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('[EXPORT] Response status:', res.status);
            if (!res.ok) throw new Error('Export failed');

            const contentDisposition = res.headers.get('Content-Disposition');
            console.log('[EXPORT] Content-Disposition header:', contentDisposition);

            let filename = `${(project.title || 'document').replace(/[<>:"/\\|?*]/g, '')}.${format}`;
            console.log('[EXPORT] Default filename:', filename);

            if (contentDisposition) {
                // Try to extract filename* (RFC 6266) first, then fall back to filename
                const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
                const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);

                if (filenameStarMatch && filenameStarMatch[1]) {
                    filename = decodeURIComponent(filenameStarMatch[1]);
                    console.log('[EXPORT] Extracted filename from filename*:', filename);
                } else if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                    console.log('[EXPORT] Extracted filename from filename:', filename);
                }
            }

            console.log('[EXPORT] Final filename:', filename);

            const blob = await res.blob();
            console.log('[EXPORT] Blob size:', blob.size, 'type:', blob.type);

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            console.log('[EXPORT] Download triggered');

            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (err: any) {
            console.error('[EXPORT] Error:', err);
            setError(err.message);
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

    const handleSaveContent = async (sectionId: string, content: string) => {
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/sections/${sectionId}/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!res.ok) throw new Error('Failed to save content');

            // Refresh to get updated content
            await fetchProject();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddSection = async (title: string) => {
        setIsAddingSection(true);
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title })
            });

            if (!res.ok) throw new Error('Failed to add section');

            await fetchProject();
            setIsAddSectionDialogOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAddingSection(false);
        }
    };

    const handleDeleteSection = async () => {
        if (!sectionToDelete) return;

        setIsDeletingSection(true);
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/sections/${sectionToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to delete section');

            await fetchProject();
            setIsDeleteDialogOpen(false);
            setSectionToDelete(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsDeletingSection(false);
        }
    };

    const handleReorder = async (sectionIds: string[]) => {
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/outline`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ section_ids: sectionIds })
            });

            if (!res.ok) throw new Error('Failed to reorder sections');

            await fetchProject();
        } catch (err: any) {
            setError(err.message);
            // Revert on error
            fetchProject();
        }
    };

    const handleMoveUp = async (sectionId: string) => {
        const index = project.outline.findIndex((s: any) => s.id === sectionId);
        if (index > 0) {
            const newOrder = [...project.outline];
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
            await handleReorder(newOrder.map((s: any) => s.id));
        }
    };

    const handleMoveDown = async (sectionId: string) => {
        const index = project.outline.findIndex((s: any) => s.id === sectionId);
        if (index < project.outline.length - 1) {
            const newOrder = [...project.outline];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            await handleReorder(newOrder.map((s: any) => s.id));
        }
    };

    const handleDeleteClick = (sectionId: string) => {
        const section = project.outline.find((s: any) => s.id === sectionId);
        if (section) {
            setSectionToDelete({ id: sectionId, title: section.title });
            setIsDeleteDialogOpen(true);
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
            <div className="flex items-start gap-3 mb-8">
                <Link href="/dashboard" className="mt-1">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight break-words">{project.title}</h1>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {new Date(project.updated_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" /> {project.owner_uid}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsExportDialogOpen(true)}
                            className="gap-2 shrink-0"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Export Dialog */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
                onExport={handleExport}
                projectTitle={project.title}
                projectType={project.doc_type}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6 min-w-0">
                    {(!project.outline || project.outline.length === 0) ? (
                        <Card className="p-12 text-center border-dashed">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold">Create Your Document Outline</h3>
                                <p className="text-muted-foreground text-sm">
                                    Choose how to start building your document structure
                                </p>

                                {/* Dual Button Options */}
                                <div className="flex gap-4 justify-center items-stretch">
                                    {/* AI Generation - Highlighted */}
                                    <button
                                        onClick={() => setShowAIInput(true)}
                                        className="flex-1 max-w-xs p-6 border-2 rounded-xl hover:border-primary transition-all bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Sparkles className="h-6 w-6 text-white" />
                                            </div>
                                            <h4 className="font-semibold text-base">Generate with AI</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Let AI create a structured outline from your topic
                                            </p>
                                        </div>
                                    </button>

                                    {/* Manual Creation */}
                                    <button
                                        onClick={() => setIsAddSectionDialogOpen(true)}
                                        className="flex-1 max-w-xs p-6 border-2 rounded-xl hover:border-primary transition-all bg-background hover:shadow-lg group"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Edit className="h-6 w-6 text-foreground" />
                                            </div>
                                            <h4 className="font-semibold text-base">Add Section Manually</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Build your outline one section at a time
                                            </p>
                                        </div>
                                    </button>
                                </div>

                                {/* AI Input Field (shown after clicking AI button) */}
                                {showAIInput && (
                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Enter a topic and let AI generate a structured outline
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g. Market Analysis of EV Industry"
                                                value={suggestTopic}
                                                onChange={(e) => setSuggestTopic(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && !isSuggesting && suggestTopic && handleSuggestOutline()}
                                                autoFocus
                                            />
                                            <Button
                                                onClick={handleSuggestOutline}
                                                disabled={isSuggesting || !suggestTopic}
                                                className="min-w-[120px]"
                                            >
                                                {isSuggesting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-4 w-4" />
                                                        Generate
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <>
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    onClick={() => setShowAIInput(true)}
                                    variant="default"
                                    className="gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Generate More with AI
                                </Button>
                                <Button
                                    onClick={() => setIsAddSectionDialogOpen(true)}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Section
                                </Button>
                            </div>

                            {/* AI Input Field (shown after clicking Generate More) */}
                            {showAIInput && (
                                <Card className="p-6 border-primary/40 bg-primary/10">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                            Generate Additional Sections with AI
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            AI will analyze your existing sections and generate complementary ones to complete your outline
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g. Market Analysis of EV Industry"
                                                value={suggestTopic}
                                                onChange={(e) => setSuggestTopic(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && !isSuggesting && suggestTopic && handleSuggestOutline()}
                                                autoFocus
                                            />
                                            <Button
                                                onClick={handleSuggestOutline}
                                                disabled={isSuggesting || !suggestTopic}
                                                className="min-w-[120px]"
                                            >
                                                {isSuggesting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-4 w-4" />
                                                        Generate
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setShowAIInput(false);
                                                    setSuggestTopic('');
                                                }}
                                                variant="ghost"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}
                            <SectionList
                                sections={project.outline}
                                onGenerate={handleGenerateContent}
                                onSaveContent={handleSaveContent}
                                onReorder={handleReorder}
                                onMoveUp={handleMoveUp}
                                onMoveDown={handleMoveDown}
                                onDelete={handleDeleteClick}
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
                        </>
                    )}
                </div>

                {/* Mobile Outline Toggle Button */}
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-6 right-6 z-40 lg:hidden shadow-lg rounded-full h-14 w-14"
                    onClick={() => setIsMobileOutlineOpen(!isMobileOutlineOpen)}
                >
                    {isMobileOutlineOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
                </Button>

                {/* Mobile Outline Panel */}
                {isMobileOutlineOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsMobileOutlineOpen(false)}
                        />
                        <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border z-50 overflow-y-auto lg:hidden animate-slide-in-right">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Document Structure</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOutlineOpen(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    {project.outline?.map((section: any, index: number) => (
                                        <div
                                            key={section.id}
                                            className="group flex items-start gap-2 text-sm p-2 rounded hover:bg-accent/80 cursor-pointer transition-all"
                                        >
                                            <span className={cn("h-2 w-2 rounded-full flex-shrink-0 mt-1.5",
                                                section.status === 'done' ? 'bg-green-500' :
                                                    section.status === 'generating' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                                            )} />
                                            <button
                                                onClick={() => {
                                                    const element = document.getElementById(`section-${section.id}`);
                                                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    setIsMobileOutlineOpen(false);
                                                }}
                                                className="flex items-start gap-2 flex-1 text-left min-w-0"
                                            >
                                                <span className="text-muted-foreground font-mono text-xs mt-0.5 flex-shrink-0">{index + 1}.</span>
                                                <span className="flex-1 min-w-0 line-clamp-2 text-sm leading-snug">{section.title}</span>
                                            </button>
                                        </div>
                                    ))}
                                    {(!project.outline || project.outline.length === 0) && (
                                        <p className="text-sm text-muted-foreground italic">No sections yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Desktop Sidebar (Outline / Stats) */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <Card className="p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Document Structure</h3>
                        <div className="space-y-1">
                            {project.outline?.map((section: any, index: number) => (
                                <div
                                    key={section.id}
                                    className="group flex items-start gap-2 text-sm p-2 rounded hover:bg-accent/80 cursor-pointer transition-all"
                                >
                                    {/* Status dot - moved to left */}
                                    <span className={cn("h-2 w-2 rounded-full flex-shrink-0 mt-1.5",
                                        section.status === 'done' ? 'bg-green-500' :
                                            section.status === 'generating' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                                    )} />

                                    {/* Click to scroll to section */}
                                    <button
                                        onClick={() => {
                                            const element = document.getElementById(`section-${section.id}`);
                                            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className="flex items-start gap-2 flex-1 text-left min-w-0"
                                    >
                                        <span className="text-muted-foreground font-mono text-xs mt-0.5 flex-shrink-0">{index + 1}.</span>
                                        <span className="flex-1 min-w-0 line-clamp-2 text-sm leading-snug">{section.title}</span>
                                    </button>

                                    {/* Action buttons - visible on hover */}
                                    <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                                        {/* Move up */}
                                        {index > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveUp(section.id);
                                                }}
                                                className="p-1 rounded hover:bg-muted transition-colors"
                                                title="Move up"
                                            >
                                                <ChevronUp className="h-3 w-3" />
                                            </button>
                                        )}

                                        {/* Move down */}
                                        {index < project.outline.length - 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveDown(section.id);
                                                }}
                                                className="p-1 rounded hover:bg-muted transition-colors"
                                                title="Move down"
                                            >
                                                <ChevronDown className="h-3 w-3" />
                                            </button>
                                        )}

                                        {/* Delete */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(section.id);
                                            }}
                                            className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors"
                                            title="Delete section"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(!project.outline || project.outline.length === 0) && (
                                <p className="text-sm text-muted-foreground italic">No sections yet.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            <AddSectionDialog
                isOpen={isAddSectionDialogOpen}
                onClose={() => setIsAddSectionDialogOpen(false)}
                onAdd={handleAddSection}
                isLoading={isAddingSection}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSectionToDelete(null);
                }}
                onConfirm={handleDeleteSection}
                sectionTitle={sectionToDelete?.title || ''}
                isLoading={isDeletingSection}
            />
        </div>
    );
}
