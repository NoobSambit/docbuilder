import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    onSaveContent?: (sectionId: string, content: string) => void;
    onReorder?: (sectionIds: string[]) => void;
    onMoveUp?: (sectionId: string) => void;
    onMoveDown?: (sectionId: string) => void;
    onDelete?: (sectionId: string) => void;
}

function SortableSection({ section, index, totalSections, ...props }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} id={`section-${section.id}`}>
            <SectionUnit
                section={section}
                dragHandleProps={{ ...attributes, ...listeners }}
                isFirst={index === 0}
                isLast={index === totalSections - 1}
                {...props}
            />
        </div>
    );
}

export default function SectionList({
    sections,
    onGenerate,
    onRefine,
    onComment,
    onLikeRefinement,
    onDislikeRefinement,
    onRemove,
    onSaveContent,
    onReorder,
    onMoveUp,
    onMoveDown,
    onDelete
}: SectionListProps) {
    const [items, setItems] = useState(sections);

    // Update items when sections prop changes
    useState(() => {
        setItems(sections);
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);

            const newOrder = arrayMove(sections, oldIndex, newIndex);
            setItems(newOrder);

            // Call parent callback with new order
            if (onReorder) {
                onReorder(newOrder.map(s => s.id));
            }
        }
    };

    const handleMoveUp = (sectionId: string) => {
        const index = sections.findIndex(s => s.id === sectionId);
        if (index > 0 && onMoveUp) {
            onMoveUp(sectionId);
        }
    };

    const handleMoveDown = (sectionId: string) => {
        const index = sections.findIndex(s => s.id === sectionId);
        if (index < sections.length - 1 && onMoveDown) {
            onMoveDown(sectionId);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <SortableSection
                            key={section.id}
                            section={section}
                            index={index}
                            totalSections={sections.length}
                            onGenerate={onGenerate}
                            onRefine={onRefine}
                            onComment={onComment}
                            onLikeRefinement={onLikeRefinement}
                            onDislikeRefinement={onDislikeRefinement}
                            onSaveContent={onSaveContent}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
