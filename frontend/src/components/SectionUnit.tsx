import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronDown, ChevronRight, Sparkles, MessageSquare, History, ThumbsUp, ThumbsDown, RefreshCw, FileText, Edit3, Save, X, Loader2, GripVertical, ChevronUp, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
});

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
    onGenerate: (id: string, useRag?: boolean) => void;
    onRefine: (id: string, prompt: string) => void;
    onComment: (id: string, text: string) => void;
    onLikeRefinement: (id: string, refinementId: string) => void;
    onDislikeRefinement: (id: string, refinementId: string) => void;
    onSaveContent?: (id: string, content: string) => void;
    onMoveUp?: (id: string) => void;
    onMoveDown?: (id: string) => void;
    onDelete?: (id: string) => void;
    isFirst?: boolean;
    isLast?: boolean;
    dragHandleProps?: any;
}

export default function SectionUnit({
    section,
    onGenerate,
    onRefine,
    onComment,
    onLikeRefinement,
    onDislikeRefinement,
    onSaveContent,
    onMoveUp,
    onMoveDown,
    onDelete,
    isFirst,
    isLast,
    dragHandleProps
}: SectionUnitProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [refinePrompt, setRefinePrompt] = useState('');
    const [commentText, setCommentText] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'history' | 'comments'>('content');
    const [isRefining, setIsRefining] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [useRag, setUseRag] = useState(false);

    useEffect(() => {
        setEditedContent(section.content || '');
    }, [section.content]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const handleSave = () => {
        if (onSaveContent && editedContent !== section.content) {
            onSaveContent(section.id, editedContent);
            setIsEditMode(false);
            setHasUnsavedChanges(false);
        }
    };

    const handleCancel = () => {
        setEditedContent(section.content || '');
        setIsEditMode(false);
        setHasUnsavedChanges(false);
    };

    const handleContentChange = (html: string) => {
        setEditedContent(html);
        setHasUnsavedChanges(html !== section.content);
    };

    const handleWriteManually = () => {
        setIsEditMode(true);
        setEditedContent('<p></p>'); // Start with a minimal HTML structure
        setHasUnsavedChanges(true);
    };

    const getSanitizedContent = () => {
        if (typeof window === 'undefined' || !isMounted) {
            return section.content || '';
        }
        const DOMPurify = require('dompurify');
        return DOMPurify.sanitize(section.content || '');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30';
            case 'generating': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30';
            case 'failed': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <Card className={cn("transition-all duration-200 border-border", isExpanded ? "ring-1 ring-primary/10 shadow-sm" : "hover:bg-muted/50")}>
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3 flex-1">
                    {/* Drag Handle */}
                    {dragHandleProps && (
                        <div
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="h-5 w-5" />
                        </div>
                    )}

                    {/* Expand/Collapse */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {/* Title */}
                    <h3
                        className="font-semibold text-lg tracking-tight text-foreground cursor-pointer flex-1"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {section.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium border", getStatusColor(section.status))}>
                        {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                    </span>

                    {/* Action Buttons */}
                    {onMoveUp && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp(section.id);
                            }}
                            disabled={isFirst}
                            className="h-8 w-8"
                            title="Move up"
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    )}

                    {onMoveDown && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown(section.id);
                            }}
                            disabled={isLast}
                            className="h-8 w-8"
                            title="Move down"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    )}

                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(section.id);
                            }}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete section"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-border">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
                        <Button
                            variant={activeTab === 'content' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('content')}
                            className="h-8 text-xs font-medium"
                        >
                            <FileText className="mr-2 h-3 w-3" /> Editor
                        </Button>
                        <Button
                            variant={activeTab === 'history' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('history')}
                            className="h-8 text-xs font-medium"
                        >
                            <History className="mr-2 h-3 w-3" /> History ({section.refinement_history?.length || 0})
                        </Button>
                        <Button
                            variant={activeTab === 'comments' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('comments')}
                            className="h-8 text-xs font-medium"
                        >
                            <MessageSquare className="mr-2 h-3 w-3" /> Comments ({section.comments?.length || 0})
                        </Button>
                    </div>

                    <div className="p-6 bg-card">
                        {activeTab === 'content' && (
                            <div className="space-y-4">
                                {(section.content || isEditMode) ? (
                                    <>
                                        {/* Collapsible Summary - Only show if content exists */}
                                        {section.content && section.bullets && section.bullets.length > 0 && (
                                            <div className="border border-border rounded-md overflow-hidden">
                                                <button
                                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                                    className="w-full bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800/50 p-3 flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors"
                                                >
                                                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                                        Quick Summary ({section.bullets.length} points)
                                                    </h4>
                                                    {isSummaryExpanded ? (
                                                        <ChevronDown className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                                                    )}
                                                </button>
                                                {isSummaryExpanded && (
                                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4">
                                                        <ul className="list-disc list-inside space-y-1.5 text-sm text-blue-800 dark:text-blue-300">
                                                            {section.bullets.map((bullet, idx) => (
                                                                <li key={idx} className="leading-relaxed">{bullet}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Edit/Save Controls - Show if content exists OR if manually writing */}
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                {!isEditMode && section.content ? (
                                                    <Button
                                                        onClick={() => setIsEditMode(true)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                        Edit Content
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            onClick={handleSave}
                                                            variant="default"
                                                            size="sm"
                                                            className="gap-2"
                                                            disabled={!hasUnsavedChanges}
                                                        >
                                                            <Save className="h-4 w-4" />
                                                            Save Changes
                                                        </Button>
                                                        <Button
                                                            onClick={handleCancel}
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                            {hasUnsavedChanges && (
                                                <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                    Unsaved changes - Click Save to persist
                                                </span>
                                            )}
                                        </div>

                                        {/* Main Content - Toggle between Read and Edit */}
                                        {isEditMode ? (
                                            <RichTextEditor
                                                content={editedContent}
                                                onChange={handleContentChange}
                                                editable={true}
                                            />
                                        ) : (
                                            <div
                                                className="prose prose-sm dark:prose-invert max-w-none p-6 bg-background rounded-md border border-border shadow-sm min-h-[150px]"
                                                dangerouslySetInnerHTML={{ __html: getSanitizedContent() }}
                                            />
                                        )}

                                        {/* Refinement Input - Only show if content exists */}
                                        {section.content && (
                                            <div className="border-t border-border pt-4">
                                                <label htmlFor={`refine-${section.id}`} className="text-sm font-medium mb-2 block text-foreground">
                                                    AI Refinement Prompt
                                                </label>
                                            <p className="text-xs text-muted-foreground mb-3">
                                                Provide instructions to refine this section (e.g., &quot;Make this more formal&quot;, &quot;Convert to bullet points&quot;, &quot;Shorten to 100 words&quot;)
                                            </p>
                                            <div className="flex gap-2">
                                                <Input
                                                    id={`refine-${section.id}`}
                                                    placeholder="e.g., Make this more technical, Add statistics, Simplify language..."
                                                    value={refinePrompt}
                                                    onChange={(e) => setRefinePrompt(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleRefine()}
                                                    className="bg-background flex-1"
                                                    disabled={isRefining}
                                                />
                                                <Button
                                                    onClick={handleRefine}
                                                    disabled={!refinePrompt.trim() || isRefining}
                                                    variant="default"
                                                    className="min-w-[100px]"
                                                >
                                                    {isRefining ? (
                                                        <>
                                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                            Refining...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            Refine
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-md bg-muted/5">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground mb-6 text-sm font-medium">No content yet. Choose how to create it:</p>

                                        {/* RAG Toggle */}
                                        <div className="mb-4 space-y-2">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-md">
                                                <input
                                                    type="checkbox"
                                                    id={`rag-${section.id}`}
                                                    checked={useRag}
                                                    onChange={(e) => setUseRag(e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <label htmlFor={`rag-${section.id}`} className="text-sm font-medium text-blue-900 dark:text-blue-200 cursor-pointer flex items-center gap-1">
                                                    <span>🌐</span>
                                                    <span>Enhance with Web Research (RAG)</span>
                                                </label>
                                            </div>
                                            {useRag && (
                                                <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded text-xs text-amber-800 dark:text-amber-200">
                                                    ⚠️ Note: RAG feature requires local deployment. Due to free tier backend limitations, web search may not work on hosted deployments.
                                                </div>
                                            )}
                                        </div>

                                        {/* Dual Options for Content Creation */}
                                        <div className="flex gap-3">
                                            {/* AI Generation - Highlighted */}
                                            <Button
                                                onClick={(e) => { e.stopPropagation(); onGenerate(section.id, useRag); }}
                                                disabled={section.status === 'generating'}
                                                variant="default"
                                                className="gap-2 shadow-lg shadow-primary/25"
                                            >
                                                {section.status === 'generating' ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                                        {useRag ? 'Researching...' : 'Generating...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="h-4 w-4" />
                                                        Generate with AI
                                                    </>
                                                )}
                                            </Button>

                                            {/* Manual Writing */}
                                            <Button
                                                onClick={(e) => { e.stopPropagation(); handleWriteManually(); }}
                                                disabled={section.status === 'generating'}
                                                variant="outline"
                                                className="gap-2 bg-background"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Write Manually
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {section.refinement_history && section.refinement_history.length > 0 ? (
                                    section.refinement_history.slice().reverse().map((refinement) => (
                                        <div key={refinement.id} className="text-sm border border-border rounded-md p-4 bg-background">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                                <span className="font-medium text-foreground">Prompt: &quot;{refinement.prompt}&quot;</span>
                                                <span>{new Date(refinement.created_at).toLocaleString()}</span>
                                            </div>
                                            {refinement.diff_summary && (
                                                <div className="text-xs bg-muted/50 p-2 rounded mb-3 font-mono border border-border">{refinement.diff_summary}</div>
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
                                            <div key={comment.id} className="bg-muted/50 p-3 rounded-md text-sm border border-border">
                                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                    <span className="font-semibold text-foreground">{comment.user_id}</span>
                                                    <span>{new Date(comment.created_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-foreground/90">{comment.text}</p>
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
                                        className="bg-background"
                                    />
                                    <Button onClick={handleComment} disabled={!commentText} variant="secondary">
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
