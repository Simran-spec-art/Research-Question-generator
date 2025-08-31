
import React from 'react';

interface InputSectionProps {
  title: string;
  children: React.ReactNode;
}

export const InputSection: React.FC<InputSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
};
