"use client";

import {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
  useContext,
} from "react";
import { UniqueIndexer, UniqueIndexerInstance } from "@unique-nft/sdk";

export type IndexerContextValueType = {
  indexer?: UniqueIndexerInstance;
};

export const UniqueIndexerContext = createContext<IndexerContextValueType>({
  indexer: undefined,
});

export const baseUrl =
  process.env.NEXT_PUBLIC_INDEXER_URL || "http://localhost:3001";

export const UniqueIndexerProvider = ({ children }: PropsWithChildren) => {
  const [indexer] = useState(() => UniqueIndexer({ baseUrl }));

  const indexerValue = useMemo(() => ({ indexer }), [indexer]);

  return (
    <UniqueIndexerContext.Provider value={indexerValue}>
      {children}
    </UniqueIndexerContext.Provider>
  );
};

export const useIndexerContext = () => {
  const context = useContext(UniqueIndexerContext);
  if (!context) {
    throw new Error(
      "useIndexerContext must be used within a UniqueIndexerProvider"
    );
  }
  return context;
};
