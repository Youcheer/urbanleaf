"use client";
import React from 'react';
import Editor, { DefaultEditor } from 'react-simple-wysiwyg';

export const RichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  return (
    <div className="rich-text-wrapper bg-white">
      <DefaultEditor 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
};
