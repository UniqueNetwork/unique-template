"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import {
  Polkadot,
  IPolkadotExtensionAccount,
  IPolkadotExtensionWalletInfo,
} from "@unique-nft/utils/extension";

interface WalletContextType {
  wallets: IPolkadotExtensionWalletInfo[];
  wallet: IPolkadotExtensionWalletInfo | null;
  accounts: IPolkadotExtensionAccount[];
  selectedAccount: IPolkadotExtensionAccount | null;
  isConnecting: boolean;
  connectWallet: (wallet: IPolkadotExtensionWalletInfo) => Promise<void>;
  selectAccount: (account: IPolkadotExtensionAccount) => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}

const STORAGE_KEY = "wallet-connection";

interface StoredConnection {
  walletName: string;
  accountAddress?: string;
}

const KNOWN_WALLETS = [
  { name: "polkadot-js", title: "Polkadot.js" },
  { name: "subwallet-js", title: "SubWallet" },
  { name: "talisman", title: "Talisman" },
  { name: "enkrypt", title: "Enkrypt" },
];

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<IPolkadotExtensionWalletInfo[]>([]);
  const [wallet, setWallet] = useState<IPolkadotExtensionWalletInfo | null>(
    null
  );
  const [accounts, setAccounts] = useState<IPolkadotExtensionAccount[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<IPolkadotExtensionAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const initWallets = async () => {
      try {
        const injectedWallets = await Polkadot.listWallets();

        setWallets(injectedWallets.wallets);
      } catch (error) {
        console.error("Error loading wallets:", error);
        setWallets([]);
      }
    };

    initWallets();
  }, []);

  const saveConnection = useCallback(
    (walletName: string, accountAddress?: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ walletName, accountAddress })
        );
      }
    },
    []
  );

  const internalConnectWallet = useCallback(
    async (selectedWallet: IPolkadotExtensionWalletInfo, shouldSave = true) => {
      const requestedWallet = await Polkadot.loadWalletByName(
        selectedWallet.name
      );

      if (!requestedWallet || requestedWallet.accounts.length === 0) {
        throw new Error("No accounts found in wallet");
      }

      setWallet(requestedWallet);
      setAccounts(requestedWallet.accounts);

      if (shouldSave && requestedWallet.accounts.length > 0) {
        saveConnection(
          selectedWallet.name,
          requestedWallet.accounts[0].address
        );
      }

      return requestedWallet.accounts;
    },
    [saveConnection]
  );

  const connectWallet = useCallback(
    async (selectedWallet: IPolkadotExtensionWalletInfo) => {
      setIsConnecting(true);
      try {
        const walletAccounts = await internalConnectWallet(selectedWallet);

        if (walletAccounts.length > 0) {
          setSelectedAccount(walletAccounts[0]);
          saveConnection(selectedWallet.name, walletAccounts[0].address);
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    [internalConnectWallet, saveConnection]
  );

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setAccounts([]);
    setSelectedAccount(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const selectAccount = useCallback(
    (account: IPolkadotExtensionAccount) => {
      setSelectedAccount(account);
      if (wallet) {
        saveConnection(wallet.name, account.address);
      }
    },
    [wallet, saveConnection]
  );

  useEffect(() => {
    if (!wallets.length || typeof window === "undefined") return;

    const autoConnect = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const { walletName, accountAddress }: StoredConnection =
          JSON.parse(stored);

        const selectedWallet = wallets.find((w) => w.name === walletName);
        if (!selectedWallet) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        setIsConnecting(true);

        const walletAccounts = await internalConnectWallet(
          selectedWallet,
          false
        );

        const account = accountAddress
          ? walletAccounts.find((acc) => acc.address === accountAddress) ||
            walletAccounts[0]
          : walletAccounts[0];

        if (account) {
          setSelectedAccount(account);
          saveConnection(walletName, account.address);
        }
      } catch (error) {
        console.error("Auto-connect failed:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        setIsConnecting(false);
      }
    };

    autoConnect();
  }, [wallets, internalConnectWallet, saveConnection]);

  return (
    <WalletContext.Provider
      value={{
        wallets,
        wallet,
        accounts,
        selectedAccount,
        isConnecting,
        connectWallet,
        selectAccount,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
