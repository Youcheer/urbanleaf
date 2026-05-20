"use client";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  return (
    <div className="rich-text-wrapper">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        className="bg-white rounded-xl" 
      />
    </div>
  );
};
