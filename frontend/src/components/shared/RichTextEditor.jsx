import React from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import { htmlToMarkdown, markdownToHtml } from "../../utils/markdownUtils";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    return (
        <div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                B
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                I
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                U
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => {
                    if (editor.isActive("bulletList"))
                        editor.chain().focus().toggleBulletList().run();
                    else
                        editor.chain().focus().wrapInList("bulletList").run();
                }}
            >
                &bull; List
            </button>
            <button
                type="button"
                onClick={() => {
                    if (editor.isActive("orderedList"))
                        editor.chain().focus().toggleOrderedList().run()
                    else
                        editor.chain().focus().wrapInList("orderedList").run();
                } }
            >
                1. List
            </button>
        </div>
    );
}

const RichTextEditor = ({ value, onChange, className }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Underline,
        ],
        content: markdownToHtml(value || ""),
        onUpdate: ({ editor }) => onChange(htmlToMarkdown(editor.getHTML())),
    });

    return (
        <div
            onClick={()=> editor?.commands.focus()}
        >
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;