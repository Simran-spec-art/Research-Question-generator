
import React, { useState } from 'react';
import { X, Plus } from './icons';

interface TagInputProps {
  label: string;
  tags: string[];
  setTags: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ label, tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() !== '' && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm">
        {tags.map(tag => (
          <span key={tag} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-1 rounded-full">
            {tag}
            <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-gray-500 hover:text-gray-800">
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a covariate..."
          className="flex-grow p-1 outline-none bg-transparent"
        />
        <button type="button" onClick={handleAddTag} className="p-1 text-gray-500 hover:text-gray-800">
            <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
