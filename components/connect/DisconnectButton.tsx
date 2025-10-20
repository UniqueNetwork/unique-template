'use client';

import React from 'react';

interface DisconnectButtonProps {
  onClick: () => void;
}

export const DisconnectButton: React.FC<DisconnectButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Disconnect Wallet
    </button>
  );
};
