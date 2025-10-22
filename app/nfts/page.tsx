"use client";

import { useEffect, useState, Suspense } from "react";
import { useIndexerContext } from "@/context/UniqueIndexerContext";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { UniqueIndexerInstance } from "@unique-nft/sdk";
import NFTCard from "@/components/NFTCard";

type NFT = Awaited<
  ReturnType<UniqueIndexerInstance["nfts"]>
>["items"][number];

type Collection = Awaited<
  ReturnType<UniqueIndexerInstance["collection"]>
>;

function NFTsContent() {
  const { indexer } = useIndexerContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const collectionId = searchParams.get("collection");

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!indexer || !collectionId) {
        setError("No collection ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch collection details
        const collectionData = await indexer.collection({
          collectionId: collectionId,
        });
        setCollection(collectionData);

        // Fetch NFTs in the collection
        const response = await indexer.nfts({
          collectionIdIn: [collectionId],
          limit: 50,
          orderByTokenId: "asc",
        });

        setNfts(response.items || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch NFTs"
        );
        console.error("Error fetching NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [indexer, collectionId]);

  if (!collectionId) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-200">
          <p className="font-semibold">No collection specified</p>
          <Link
            href="/"
            className="text-sm mt-2 inline-block underline hover:text-yellow-900 dark:hover:text-yellow-100"
          >
            Go back to collections
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-80"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          <p className="font-semibold">Error loading NFTs</p>
          <p className="text-sm mt-1">{error}</p>
          <Link
            href="/"
            className="text-sm mt-2 inline-block underline hover:text-red-900 dark:hover:text-red-100"
          >
            Go back to collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Collections</span>
        </button>

        {/* Collection Header */}
        {collection && (
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              {collection.coverImage?.url && (
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={collection.coverImage.url}
                    alt={collection.name || `Collection ${collection.collectionId}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {collection.name || `Collection #${collection.collectionId}`}
                </h1>
                {collection.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">
                    Collection ID: {collection.collectionId}
                  </span>
                  {collection.tokenPrefix && (
                    <span>Prefix: {collection.tokenPrefix}</span>
                  )}
                  <span className="font-medium">
                    {nfts.length} NFT{nfts.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NFTs Grid */}
        {nfts.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center text-gray-600 dark:text-gray-400">
            <p>No NFTs found in this collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={`${nft.collectionId}-${nft.tokenId}`} nft={nft} />
            ))}
          </div>
        )}
    </div>
  );
}

export default function NFTsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-6xl mx-auto p-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        </div>
      }
    >
      <NFTsContent />
    </Suspense>
  );
}
