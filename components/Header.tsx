
import React from 'react';

interface HeaderProps {
  isCausalityMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isCausalityMode }) => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
        Research Question Generator
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        {isCausalityMode 
          ? "You're in Causality Mode. Let's design questions to uncover potential cause-and-effect relationships."
          : "An interactive canvas to structure your research thinking and scaffold question design with AI."
        }
      </p>
    </header>
  );
};
