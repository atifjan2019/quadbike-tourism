"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="border border-black/20 rounded-md bg-white min-h-[300px]" />
  ),
});

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image"],
  [{ color: [] }, { background: [] }],
  ["clean"],
];

export default function QuillEditor({ value, onChange }: Props) {
  return (
    <div className="quill-wrap border border-black/20 rounded-md bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{ toolbar: TOOLBAR }}
        placeholder="Write your post…"
      />
      <style>{`
        .quill-wrap .ql-toolbar.ql-snow {
          border: 0;
          border-bottom: 1px solid rgba(0,0,0,.1);
          border-radius: 6px 6px 0 0;
          background: #fafafa;
        }
        .quill-wrap .ql-container.ql-snow {
          border: 0;
          min-height: 360px;
          font-family: inherit;
          font-size: 15px;
        }
        .quill-wrap .ql-editor {
          min-height: 360px;
          padding: 16px 20px;
        }
        .quill-wrap .ql-editor h1 { font-size: 28px; font-weight: 800; margin: 16px 0 8px; }
        .quill-wrap .ql-editor h2 { font-size: 22px; font-weight: 700; margin: 14px 0 8px; }
        .quill-wrap .ql-editor h3 { font-size: 18px; font-weight: 700; margin: 12px 0 6px; }
      `}</style>
    </div>
  );
}
