'use client';

import React from 'react';
import type { IPolkadotExtensionAccount } from '@unique-nft/utils/extension';

interface AccountItemProps {
  account: IPolkadotExtensionAccount;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const AccountItem: React.FC<AccountItemProps> = ({
  account,
  index,
  isSelected,
  onSelect,
}) => {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {account.wallet?.logo?.url && (
        <img
          src={account.wallet.logo.url}
          alt={account.wallet.prettyName}
          className="w-10 h-10 rounded"
        />
      )}
      <div className="flex-1 flex flex-col items-start gap-1">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {account.name || `Account ${index + 1}`}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          {shortenAddress(account.address)}
        </span>
      </div>
      {isSelected && (
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          ✓
        </span>
      )}
    </button>
  );
};
