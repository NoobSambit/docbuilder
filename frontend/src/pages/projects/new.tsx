import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileText, Presentation, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewProject() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [docType, setDocType] = useState('docx');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const token = await user?.getIdToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, doc_type: docType })
            });

            if (!res.ok) throw new Error('Failed to create project');

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    if (loading || !user) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-lg border-border/60">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle>Create New Project</CardTitle>
                    </div>
                    <CardDescription>
                        Start a new document or presentation. AI will help you generate the content.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Project Title
                            </label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="e.g., Q3 Market Analysis"
                                disabled={isSubmitting}
                                autoFocus
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Document Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={cn(
                                        "cursor-pointer border rounded-md p-4 flex flex-col items-center gap-2 transition-all hover:bg-accent hover:text-accent-foreground",
                                        docType === 'docx' ? "border-foreground bg-foreground/5 ring-1 ring-foreground/10" : "border-input"
                                    )}
                                    onClick={() => setDocType('docx')}
                                >
                                    <FileText className={cn("h-8 w-8", docType === 'docx' ? "text-foreground" : "text-muted-foreground")} />
                                    <span className="text-sm font-medium">Word Document</span>
                                </div>
                                <div
                                    className={cn(
                                        "cursor-pointer border rounded-md p-4 flex flex-col items-center gap-2 transition-all hover:bg-accent hover:text-accent-foreground",
                                        docType === 'pptx' ? "border-foreground bg-foreground/5 ring-1 ring-foreground/10" : "border-input"
                                    )}
                                    onClick={() => setDocType('pptx')}
                                >
                                    <Presentation className={cn("h-8 w-8", docType === 'pptx' ? "text-foreground" : "text-muted-foreground")} />
                                    <span className="text-sm font-medium">Presentation</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t border-border/40 pt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="min-w-[120px] bg-foreground text-background hover:bg-foreground/90"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
