
import React from 'react';
import { PrimaryRole, MainTask } from '../types';

interface OutputCardProps {
  question: string;
  role: PrimaryRole;
  task: MainTask;
  tone: string;
  variantType: string;
}

const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <span className={`inline-block bg-gray-100 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-1 rounded-full ${className}`}>
        {children}
    </span>
);

export const OutputCard: React.FC<OutputCardProps> = ({ question, role, task, tone, variantType }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 animate-fade-in">
      <div className="mb-3">
        <Badge className="bg-blue-100 text-blue-800">{role}</Badge>
        <Badge className="bg-purple-100 text-purple-800">{task}</Badge>
        <Badge className="bg-green-100 text-green-800">{tone}</Badge>
        <Badge className="bg-yellow-100 text-yellow-800">{variantType}</Badge>
      </div>
      <p className="text-gray-800">{question}</p>
    </div>
  );
};

// Add fade-in animation to tailwind config or a style tag if needed.
// For simplicity, we can just use a simple one here.
if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}
