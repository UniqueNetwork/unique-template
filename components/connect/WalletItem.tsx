"use client";

import React from "react";
import { IPolkadotExtensionWalletInfo } from "@unique-nft/utils/extension";

interface WalletItemProps {
  wallet: IPolkadotExtensionWalletInfo;
  isSelected: boolean;
  isConnecting: boolean;
  onClick: () => void;
}

export const WalletItem: React.FC<WalletItemProps> = ({
  wallet,
  isSelected,
  isConnecting,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      } ${isConnecting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {wallet.logo?.url && (
        <img
          src={wallet.logo.url}
          alt={wallet.prettyName}
          className="w-8 h-8 rounded"
        />
      )}
      <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100">
        {wallet.prettyName}
      </span>
      {isSelected && (
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          Connected
        </span>
      )}
    </button>
  );
};
