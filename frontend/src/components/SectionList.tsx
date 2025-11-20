import SectionUnit from './SectionUnit';

interface Section {
    id: string;
    title: string;
    word_count: number;
    status: string;
    content?: string;
    bullets?: string[];
    refinement_history?: any[];
    comments?: any[];
    version?: number;
}

interface SectionListProps {
    sections: Section[];
    onGenerate: (sectionId: string) => void;
    onRefine: (sectionId: string, prompt: string) => void;
    onComment: (sectionId: string, text: string) => void;
    onLikeRefinement: (sectionId: string, refinementId: string) => void;
    onDislikeRefinement: (sectionId: string, refinementId: string) => void;
    onRemove: (sectionId: string) => void;
}

export default function SectionList({ sections, onGenerate, onRefine, onComment, onLikeRefinement, onDislikeRefinement, onRemove }: SectionListProps) {
    return (
        <div className="space-y-4">
            {sections.map((section, index) => (
                <div key={section.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <SectionUnit
                        section={section}
                        onGenerate={onGenerate}
                        onRefine={onRefine}
                        onComment={onComment}
                        onLikeRefinement={onLikeRefinement}
                        onDislikeRefinement={onDislikeRefinement}
                    />
                </div>
            ))}
        </div>
    );
}
