
import React from 'react';

interface ToggleProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ enabled, setEnabled }) => {
  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? 'bg-primary' : 'bg-gray-200'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </button>
  );
};
