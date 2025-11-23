import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Theme {
    name: string;
    display_name: string;
    background_color: string;
    title_color: string;
    text_color: string;
    accent_color: string;
    font_title: string;
    font_body: string;
    description: string;
}

interface ThemeSelectorProps {
    selectedTheme: string;
    onThemeChange: (themeName: string) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/themes`);
            if (!res.ok) throw new Error('Failed to fetch themes');
            const data = await res.json();
            setThemes(data.themes || []);
        } catch (err) {
            console.error('Error fetching themes:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-sm text-muted-foreground">Loading themes...</div>;
    }

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium">Select Presentation Theme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {themes.map((theme) => (
                    <Card
                        key={theme.name}
                        className={cn(
                            "p-4 cursor-pointer border-2 transition-all hover:shadow-md",
                            selectedTheme === theme.name
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                        )}
                        onClick={() => onThemeChange(theme.name)}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm">{theme.display_name}</h4>
                                    {selectedTheme === theme.name && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{theme.description}</p>

                                {/* Color Palette Preview */}
                                <div className="flex gap-1.5 mt-2">
                                    <div
                                        className="w-6 h-6 rounded border border-gray-300"
                                        style={{ backgroundColor: theme.background_color }}
                                        title="Background"
                                    />
                                    <div
                                        className="w-6 h-6 rounded border border-gray-300"
                                        style={{ backgroundColor: theme.title_color }}
                                        title="Title"
                                    />
                                    <div
                                        className="w-6 h-6 rounded border border-gray-300"
                                        style={{ backgroundColor: theme.text_color }}
                                        title="Text"
                                    />
                                    <div
                                        className="w-6 h-6 rounded border border-gray-300"
                                        style={{ backgroundColor: theme.accent_color }}
                                        title="Accent"
                                    />
                                </div>

                                <p className="text-xs text-muted-foreground mt-1">
                                    Font: {theme.font_title}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
