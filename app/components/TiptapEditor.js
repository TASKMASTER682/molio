// app/components/TiptapEditor.js
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useState, useEffect } from "react";
import { BlockEditorModal } from "./editor/BlockEditorModal";
import {
  customBlockExtensions,
} from "./editor/BlockExtensions";

export function TiptapEditor({ content, onChange, editable = true }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [htmlModalOpen, setHtmlModalOpen] = useState(false);
  const [pastedHtml, setPastedHtml] = useState("");
  const [toolbarRefresh, setToolbarRefresh] = useState(0);
  
  const forceUpdate = () => setToolbarRefresh(k => k + 1);
  
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        HTMLAttributes: {
          class: '',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-white/[0.08] p-2',
        },
      }),
      Placeholder.configure({
        placeholder: "Write your amazing blog content here...",
      }),
      ...customBlockExtensions,
    ],
    content: content || "",
    editable: editable,
    onSelectionUpdate: ({ editor }) => {
      forceUpdate();
    },
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      html = html.replace(/<p>\s*<(statsBlock|workflowBlock|caseStudyBlock|highlightBlock|techGridBlock|quoteBlock)([^>]*)>\s*<\/\1>\s*<\/p>/g, "<$1$2></$1>");
      html = html.replace(/<p>\s*<(statsBlock|workflowBlock|caseStudyBlock|highlightBlock|techGridBlock|quoteBlock)([^>]*)\/>\s*<\/p>/g, "<$1$2></$1>");
      onChange(html);
      forceUpdate();
    },
    editorProps: {
      attributes: {
        class: "tiptap min-h-[300px] focus:outline-none",
      },
    },
  });

  if (!editor) {
    return <div className="border border-white/[0.08] rounded-lg bg-white/[0.02] p-4 min-h-[300px] text-white/30">Loading...</div>;
  }

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      if (file.size > 512 * 1024) {
        alert("Image must be less than 1MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const toggleFormat = (command) => {
    command.run();
  };

  const openBlockModal = (blockType) => {
    setSelectedBlock(blockType);
    setModalOpen(true);
  };

  const handleInsertBlock = (blockType, data) => {
    editor.chain().focus().insertContent({ type: blockType, attrs: data }).run();
  };

  const openHtmlModal = () => {
    setHtmlModalOpen(true);
  };

  const insertHtml = () => {
    if (pastedHtml && editor) {
      const cleaned = pastedHtml.trim();
      editor.chain().focus().insertContent(cleaned).run();
      setPastedHtml("");
      setHtmlModalOpen(false);
    }
  };

  return (
    <div className="border border-white/[0.08] rounded-lg overflow-hidden bg-white/[0.02]">
      {editable && (
        <div className="flex flex-wrap gap-1 p-2 border-b border-white/[0.08] bg-white/[0.02]" key={toolbarRefresh}>
          <button
            type="button"
            onClick={() => toggleFormat(editor.chain().focus().toggleBold())}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("bold") ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => toggleFormat(editor.chain().focus().toggleItalic())}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("italic") ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("heading", { level: 2 }) ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("heading", { level: 3 }) ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => toggleFormat(editor.chain().focus().toggleBulletList())}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("bulletList") ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => toggleFormat(editor.chain().focus().toggleOrderedList())}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("orderedList") ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Numbered List"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => toggleFormat(editor.chain().focus().toggleBlockquote())}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("blockquote") ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Quote"
          >
            "
          </button>
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Add Image"
          >
            🖼️
          </button>
          <button
            type="button"
            onClick={addLink}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("link") ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Add Link"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={() => toggleFormat(editor.chain().focus().toggleCodeBlock())}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive("codeBlock") ? "bg-white/10 text-cyan" : "text-white/60"}`}
            title="Code Block"
          >
            {"</>"}
          </button>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
            }}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Insert Table"
          >
            🧾
          </button>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().deleteTable().run();
            }}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Delete Table"
          >
            🗑️
          </button>
          <div className="w-px h-8 bg-white/10 mx-1" />
          <button
            type="button"
            onClick={() => openBlockModal("statsBlock")}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Insert Stats Block"
          >
            📊
          </button>
          <button
            type="button"
            onClick={() => openBlockModal("highlightBlock")}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Insert Highlight Box"
          >
            💡
          </button>
          <button
            type="button"
            onClick={() => openBlockModal("caseStudyBlock")}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Insert Case Study"
          >
            📁
          </button>
          <button
            type="button"
            onClick={() => openBlockModal("workflowBlock")}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Insert Workflow"
          >
            🔄
          </button>
          <div className="w-px h-8 bg-white/10 mx-1" />
          <button
            type="button"
            onClick={openHtmlModal}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            title="Paste HTML"
          >
            📋
          </button>
        </div>
      )}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
      <BlockEditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        blockType={selectedBlock}
        onInsert={handleInsertBlock}
      />
      {htmlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setHtmlModalOpen(false)} />
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Insert HTML</h3>
              <button onClick={() => setHtmlModalOpen(false)} className="text-white/50 hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-white/50 text-xs">Paste any HTML code to insert it directly into the editor.</p>
              <textarea
                value={pastedHtml}
                onChange={(e) => setPastedHtml(e.target.value)}
                placeholder="<p>Your HTML here...</p>"
                rows={6}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 font-mono resize-none"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={insertHtml}
                  className="flex-1 py-2.5 bg-cyan/20 text-cyan rounded-lg hover:bg-cyan/30 transition-colors"
                >
                  Insert HTML
                </button>
                <button
                  type="button"
                  onClick={() => setHtmlModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}