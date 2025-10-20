'use client';

import React from 'react';
import { useWallet } from '@/context/WalletContext';

export const ConnectButton: React.FC = () => {
  const { selectedAccount } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleClick = () => {
    const event = new CustomEvent('open-wallet-modal');
    window.dispatchEvent(event);
  };

  if (selectedAccount) {
    return (
      <button onClick={handleClick} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors duration-200">
        {selectedAccount.wallet?.logo?.url && (
          <img
            src={selectedAccount.wallet.logo.url}
            alt={selectedAccount.wallet.prettyName}
            className="w-6 h-6 rounded"
          />
        )}
        <div className="flex flex-col items-end">
          <span className="text-sm">{selectedAccount.name || 'Account'}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {shortenAddress(selectedAccount.address)}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Connect Wallet
    </button>
  );
};
