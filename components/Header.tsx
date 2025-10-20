'use client';

import WalletConnect from '@/components/WalletConnect';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Unique NFT
            </h1>
          </div>

          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
