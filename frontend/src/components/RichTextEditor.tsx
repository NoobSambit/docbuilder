import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
    Heading2, Heading3, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    editable?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, editable = true }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content || '',
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editable, editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        icon: Icon,
        label
    }: {
        onClick: () => void;
        isActive?: boolean;
        icon: any;
        label: string;
    }) => (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent focus loss
                onClick();
            }}
            className={cn(
                "p-2 rounded hover:bg-accent transition-colors",
                isActive && "bg-accent text-accent-foreground"
            )}
            title={label}
        >
            <Icon className="h-4 w-4" />
        </button>
    );

    return (
        <div className="border rounded-md overflow-hidden">
            {editable && (
                <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 items-center">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={Bold}
                        label="Bold (Ctrl+B)"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={Italic}
                        label="Italic (Ctrl+I)"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        icon={UnderlineIcon}
                        label="Underline (Ctrl+U)"
                    />
                    <div className="w-px h-6 bg-border mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        icon={Heading2}
                        label="Heading 2"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        icon={Heading3}
                        label="Heading 3"
                    />
                    <div className="w-px h-6 bg-border mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon={List}
                        label="Bullet List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon={ListOrdered}
                        label="Numbered List"
                    />
                    <div className="w-px h-6 bg-border mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        icon={AlignLeft}
                        label="Align Left"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        icon={AlignCenter}
                        label="Align Center"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        icon={AlignRight}
                        label="Align Right"
                    />
                </div>
            )}
            <EditorContent
                editor={editor}
                className={cn(
                    "prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none",
                    !editable && "cursor-default"
                )}
            />
        </div>
    );
};

export default RichTextEditor;
