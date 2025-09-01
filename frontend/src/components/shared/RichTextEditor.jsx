import React from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import { htmlToMarkdown, markdownToHtml } from "../../utils/markdownUtils";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const buttonClass = (active) =>
        `px-2 py-1 border rounded hover:bg-gray-100 ${active ? "bg-gray-200 border-gray-400" : "border-gray-300"}`;

    return (
        <div className="flex gap-2 mb-2 border-b p-1 flex-wrap">
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
                className={buttonClass(editor.isActive("heading", { level: 1 }))}
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                H1
            </button>
            <button
                className={buttonClass(editor.isActive("heading", { level: 2 }))}
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                H2
            </button>
            <button
                className={buttonClass(editor.isActive("bulletList"))}
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
                className={buttonClass(editor.isActive("orderedList"))}
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
        editorProps: {
            attributes: {
                class: [
                "focus:outline-none p-2 [&>p]:m-0 [&>p]:leading-normal",
                "[&_ul]:list-disc [&_ul]:pl-6",
                "[&_ol]:list-decimal [&_ol]:pl-6",
            ].join(" ")},
        },
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

export default RichTextEditor;