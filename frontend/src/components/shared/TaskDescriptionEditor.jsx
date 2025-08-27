import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const buttonClass = (active) =>
        `px-2 py-1 border rounded hover:bg-gray-100 ${active ? 'bg-gray-200 border-gray-400' : 'border-gray-300'}`;

    return (
        <div className="flex gap-2 mb-2 border-b p-1">
            <button
                className={buttonClass(editor.isActive("bold"))}
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                B
            </button>
            <button
                className={buttonClass(editor.isActive("italic"))}
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                I
            </button>
            <button
                className={buttonClass(editor.isActive("underline"))}
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                U
            </button>
            <button
                className={buttonClass(editor.isActive("bulletList"))}
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                List
            </button>
        </div>
    );
}

const TaskDescriptionEditor = ({ value, onChange, className }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ underline: true }),
            Placeholder.configure({
                placeholder: "Enter task description...",
                showOnlyWhenEditable: true,
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: "focus:outline-none p-2 [&>p]:m-0 [&>p]:leading-normal",
            }
        }
    });

    return (
        <div className={`border rounded-lg h-full overflow-y-auto ${className}`}
            onClick={()=> editor?.commands.focus()}
        >
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TaskDescriptionEditor;