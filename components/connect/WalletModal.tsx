'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { AccountItem } from './AccountItem';
import { DisconnectButton } from './DisconnectButton';
import { ModalHeader } from './ModalHeader';
import { ModalOverlay } from './ModalOverlay';
import { WalletItem } from './WalletItem';

export const WalletModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const {
    wallets,
    wallet,
    accounts,
    selectedAccount,
    connectWallet,
    selectAccount,
    disconnectWallet,
    isConnecting,
  } = useWallet();

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      if (wallet && accounts.length > 0) {
        setShowAccounts(true);
      } else {
        setShowAccounts(false);
      }
    };
    window.addEventListener('open-wallet-modal', handleOpenModal);
    return () =>
      window.removeEventListener('open-wallet-modal', handleOpenModal);
  }, [wallet, accounts]);

  const handleClose = () => {
    setIsOpen(false);
    setShowAccounts(false);
  };

  const handleWalletClick = async (selectedWallet: any) => {
    try {
      await connectWallet(selectedWallet);
      setShowAccounts(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleAccountSelect = (account: any) => {
    selectAccount(account);
    handleClose();
  };

  const handleBack = () => {
    setShowAccounts(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    handleClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <ModalHeader
        title={showAccounts ? 'Select Account' : 'Connect Wallet'}
        onClose={handleClose}
        onBack={handleBack}
        showBackButton={showAccounts}
      />

      <div className="p-6">
        {!showAccounts ? (
          <>
            {wallets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No wallets found. Please install a Polkadot wallet extension.
                </p>
                <a
                  href="https://polkadot.js.org/extension/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  Install Polkadot.js Extension
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {wallets.map((w) => (
                  <WalletItem
                    key={w.name}
                    wallet={w}
                    isSelected={wallet?.name === w.name}
                    isConnecting={isConnecting}
                    onClick={() => handleWalletClick(w)}
                  />
                ))}
              </div>
            )}

            {selectedAccount && <DisconnectButton onClick={handleDisconnect} />}
          </>
        ) : (
          <>
            {accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.map((account, index) => (
                  <AccountItem
                    key={account.address}
                    account={account}
                    index={index}
                    isSelected={selectedAccount?.address === account.address}
                    onSelect={() => handleAccountSelect(account)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No accounts found
              </div>
            )}

            {selectedAccount && <DisconnectButton onClick={handleDisconnect} />}
          </>
        )}
      </div>
    </ModalOverlay>
  );
};
