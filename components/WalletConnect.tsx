'use client';

import { ConnectButton } from './connect/ConnectButton';
import { WalletModal } from './connect/WalletModal';

export default function WalletConnect() {
  return (
    <>
      <ConnectButton />
      <WalletModal />
    </>
  );
}
