"use client";

import { useEffect, useState } from "react";
import { useIndexerContext } from "@/context/UniqueIndexerContext";
import Image from "next/image";
import Link from "next/link";
import { UniqueIndexerInstance } from "@unique-nft/sdk";

type Collection = Awaited<
  ReturnType<UniqueIndexerInstance["collections"]>
>["items"][number];

export default function CollectionsList() {
  const { indexer } = useIndexerContext();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!indexer) return;

      try {
        setLoading(true);
        setError(null);
        const response = await indexer.collections({
          limit: 20,
          orderByCollectionId: "desc",
          isBurned: false,
        });

        setCollections(response.items || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch collections"
        );
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [indexer]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          <p className="font-semibold">Error loading collections</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center text-gray-600 dark:text-gray-400">
          <p>No collections found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Blockchain Collections
      </h2>
      <div className="space-y-3">
        {collections.map((collection) => (
          <Link
            key={collection.collectionId}
            href={`/nfts?collection=${collection.collectionId}`}
            className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
          >
            {/* Collection Cover */}
            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {collection.coverImage?.url ? (
                <Image
                  src={collection.coverImage?.url}
                  alt={
                    collection.name || `Collection ${collection.collectionId}`
                  }
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg
                    className="w-12 h-12"
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

            {/* Collection Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {collection.name || `Collection #${collection.collectionId}`}
                </h3>
                <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  #{collection.collectionId}
                </span>
              </div>
              {collection.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {collection.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                {collection.tokenPrefix && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Prefix:</span>
                    <span>{collection.tokenPrefix}</span>
                  </div>
                )}
                {collection.mode && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Mode:</span>
                    <span>{collection.mode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Info */}
            {collection.owner && (
              <div className="flex-shrink-0 hidden md:block">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Owner
                </div>
                <div className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate max-w-[160px]">
                  {collection.owner.slice(0, 6)}...{collection.owner.slice(-6)}
                </div>
              </div>
            )}

            {/* Arrow Icon */}
            <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
