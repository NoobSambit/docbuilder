import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Download, X, FileText, Presentation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: 'docx' | 'pptx', theme?: string) => void;
    projectTitle: string;
    projectType: 'docx' | 'pptx';
}

export function ExportDialog({ isOpen, onClose, onExport, projectTitle, projectType }: ExportDialogProps) {
    const [selectedTheme, setSelectedTheme] = useState('professional');

    if (!isOpen) return null;

    const handleExport = () => {
        if (projectType === 'pptx') {
            onExport('pptx', selectedTheme);
        } else {
            onExport('docx');
        }
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-xl font-semibold">Export Project</h2>
                            <p className="text-sm text-muted-foreground mt-1">{projectTitle}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Format Info - No Selection Needed */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium">Export Format</h3>
                            {projectType === 'docx' ? (
                                <Card className="p-4 border-2 border-primary bg-primary/5">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Word Document</h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Export as .docx file with full formatting
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-4 border-2 border-primary bg-primary/5">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Presentation className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">PowerPoint Presentation</h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Export as .pptx presentation with custom themes
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Theme Selection (only for PPTX) */}
                        {projectType === 'pptx' && (
                            <ThemeSelector
                                selectedTheme={selectedTheme}
                                onThemeChange={setSelectedTheme}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleExport}
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export {projectType.toUpperCase()}
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}
