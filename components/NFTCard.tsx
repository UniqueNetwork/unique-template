import Image from "next/image";
import Link from "next/link";
import { UniqueIndexerInstance } from "@unique-nft/sdk";

type NFT = Awaited<ReturnType<UniqueIndexerInstance["nfts"]>>["items"][number];

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  return (
    <Link
      href={`/nft/${nft.collectionId}/${nft.tokenId}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg"
    >
      {/* NFT Image */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
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
              className="w-16 h-16"
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

      {/* NFT Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
          {nft.name || `Token #${nft.tokenId}`}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">#{nft.tokenId}</span>
          {nft.owner && (
            <span className="font-mono text-xs truncate max-w-[100px]">
              {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
            </span>
          )}
        </div>
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {nft.attributes.length} attribute
              {nft.attributes.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
