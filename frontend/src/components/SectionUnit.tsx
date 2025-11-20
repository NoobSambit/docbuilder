import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronDown, ChevronRight, Sparkles, MessageSquare, History, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Refinement {
    id: string;
    user_id: string;
    prompt: string;
    parsed_text: string;
    diff_summary?: string;
    created_at: string;
    likes: string[];
    dislikes: string[];
}

interface Comment {
    id: string;
    user_id: string;
    text: string;
    created_at: string;
}

interface Section {
    id: string;
    title: string;
    word_count: number;
    status: string;
    content?: string;
    bullets?: string[];
    refinement_history?: Refinement[];
    comments?: Comment[];
    version?: number;
}

interface SectionUnitProps {
    section: Section;
    onGenerate: (id: string) => void;
    onRefine: (id: string, prompt: string) => void;
    onComment: (id: string, text: string) => void;
    onLikeRefinement: (id: string, refinementId: string) => void;
    onDislikeRefinement: (id: string, refinementId: string) => void;
}

export default function SectionUnit({ section, onGenerate, onRefine, onComment, onLikeRefinement, onDislikeRefinement }: SectionUnitProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [refinePrompt, setRefinePrompt] = useState('');
    const [commentText, setCommentText] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'history' | 'comments'>('content');
    const [isRefining, setIsRefining] = useState(false);

    const handleRefine = async () => {
        if (!refinePrompt) return;
        setIsRefining(true);
        await onRefine(section.id, refinePrompt);
        setIsRefining(false);
        setRefinePrompt('');
    };

    const handleComment = () => {
        if (!commentText) return;
        onComment(section.id, commentText);
        setCommentText('');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'bg-green-100 text-green-700 border-green-200';
            case 'generating': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-secondary text-secondary-foreground';
        }
    };

    return (
        <Card className={cn("transition-all duration-200", isExpanded ? "ring-1 ring-primary/5" : "hover:bg-accent/5")}>
            <div
                className="flex justify-between items-center p-4 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    <h3 className="font-semibold text-lg tracking-tight">{section.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium border", getStatusColor(section.status))}>
                        {section.status}
                    </span>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t bg-card/50">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b bg-muted/20">
                        <Button
                            variant={activeTab === 'content' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('content')}
                            className="h-8 text-xs"
                        >
                            <Sparkles className="mr-2 h-3 w-3" /> Editor
                        </Button>
                        <Button
                            variant={activeTab === 'history' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('history')}
                            className="h-8 text-xs"
                        >
                            <History className="mr-2 h-3 w-3" /> History ({section.refinement_history?.length || 0})
                        </Button>
                        <Button
                            variant={activeTab === 'comments' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('comments')}
                            className="h-8 text-xs"
                        >
                            <MessageSquare className="mr-2 h-3 w-3" /> Comments ({section.comments?.length || 0})
                        </Button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'content' && (
                            <div className="space-y-4">
                                {section.content ? (
                                    <div className="prose prose-sm max-w-none p-6 bg-background rounded-lg border shadow-sm min-h-[150px]">
                                        {section.content}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
                                        <Sparkles className="h-8 w-8 text-muted-foreground mb-3" />
                                        <p className="text-muted-foreground mb-4 text-sm">No content generated yet.</p>
                                        <Button
                                            onClick={(e) => { e.stopPropagation(); onGenerate(section.id); }}
                                            disabled={section.status === 'generating'}
                                        >
                                            {section.status === 'generating' ? (
                                                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                                            ) : (
                                                <><Sparkles className="mr-2 h-4 w-4" /> Generate Content</>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {section.refinement_history && section.refinement_history.length > 0 ? (
                                    section.refinement_history.slice().reverse().map((refinement) => (
                                        <div key={refinement.id} className="text-sm border rounded-lg p-4 bg-background">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                                <span className="font-medium text-foreground">Prompt: &quot;{refinement.prompt}&quot;</span>
                                                <span>{new Date(refinement.created_at).toLocaleString()}</span>
                                            </div>
                                            {refinement.diff_summary && (
                                                <div className="text-xs bg-muted p-2 rounded mb-3 font-mono">{refinement.diff_summary}</div>
                                            )}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn("h-6 text-xs gap-1", refinement.likes.includes('current_user') && "text-primary")}
                                                    onClick={() => onLikeRefinement(section.id, refinement.id)}
                                                >
                                                    <ThumbsUp className="h-3 w-3" /> {refinement.likes.length}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn("h-6 text-xs gap-1", refinement.dislikes.includes('current_user') && "text-destructive")}
                                                    onClick={() => onDislikeRefinement(section.id, refinement.id)}
                                                >
                                                    <ThumbsDown className="h-3 w-3" /> {refinement.dislikes.length}
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">No refinement history.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'comments' && (
                            <div className="space-y-4">
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                    {section.comments && section.comments.length > 0 ? (
                                        section.comments.map((comment) => (
                                            <div key={comment.id} className="bg-muted/50 p-3 rounded-lg text-sm border">
                                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                    <span className="font-semibold text-foreground">{comment.user_id}</span>
                                                    <span>{new Date(comment.created_at).toLocaleString()}</span>
                                                </div>
                                                <p>{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground text-sm">No comments yet.</div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                                    />
                                    <Button onClick={handleComment} disabled={!commentText}>
                                        Post
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
}
