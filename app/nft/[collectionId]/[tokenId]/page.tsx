"use client";

import { useEffect, useState } from "react";
import { useIndexerContext } from "@/context/UniqueIndexerContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { UniqueIndexerInstance } from "@unique-nft/sdk";

type NFTDetail = Awaited<ReturnType<UniqueIndexerInstance["nft"]>>;
type Collection = Awaited<ReturnType<UniqueIndexerInstance["collection"]>>;

export default function NFTDetailPage() {
  const { indexer } = useIndexerContext();
  const params = useParams();
  const router = useRouter();
  const collectionId = params.collectionId as string;
  const tokenId = params.tokenId as string;

  const [nft, setNft] = useState<NFTDetail | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFT = async () => {
      if (!indexer || !collectionId || !tokenId) {
        setError("Missing NFT information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [nftData, collectionData] = await Promise.all([
          indexer.nft({
            collectionId: collectionId,
            tokenId: parseInt(tokenId),
          }),
          indexer.collection({
            collectionId: collectionId,
          }),
        ]);

        setNft(nftData);
        setCollection(collectionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch NFT");
        console.error("Error fetching NFT:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFT();
  }, [indexer, collectionId, tokenId]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8" />
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          <p className="font-semibold">Error loading NFT</p>
          <p className="text-sm mt-1">{error || "NFT not found"}</p>
          <button
            onClick={() => router.back()}
            className="text-sm mt-2 inline-block underline hover:text-red-900 dark:hover:text-red-100"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
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
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NFT Image */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
          {nft.image ? (
            <Image
              src={nft.image}
              alt={nft.name || `Token #${nft.tokenId}`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <svg
                className="w-32 h-32"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* NFT Details */}
        <div className="space-y-6">
          {/* Title and Collection */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {nft.name ? `${nft.name} #${nft.tokenId}` : `Token #${nft.tokenId}`}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {collection?.name || `Collection #${nft.collectionId}`}
            </p>
          </div>

          {/* Description */}
          {nft.description && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {nft.description}
              </p>
            </div>
          )}

          {/* Owner */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Owner
            </h3>
            <p className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
              {nft.owner}
            </p>
          </div>

          {/* Attributes */}
          {nft.attributes && nft.attributes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Attributes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {attr.trait_type}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {attr.value}
                    </p>
                    {attr.display_type && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {attr.display_type}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Blockchain Data
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Token Address
                </span>
                <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
                  {nft.tokenAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Collection Address
                </span>
                <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
                  {nft.collectionAddress}
                </span>
              </div>
              {nft.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Created At
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(nft.createdAt).toLocaleString()}
                  </span>
                </div>
              )}
              {nft.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Updated At
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(nft.updatedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* External Links */}
          {(nft.externalUrl || nft.youtubeUrl) && (
            <div className="space-y-2">
              {nft.externalUrl && (
                <a
                  href={nft.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  View External Link
                </a>
              )}
              {nft.youtubeUrl && (
                <a
                  href={nft.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  Watch on YouTube
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
