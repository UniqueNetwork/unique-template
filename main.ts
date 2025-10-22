import { UniqueChain } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";

const main = async () => {
  const account = Sr25519Account.fromUri("//Alice"); // //Bob, //Charlie

  const sdk = UniqueChain({
    baseUrl: "http://localhost:3000",
    account,
  });

  const collection = await sdk.collection.create({
    name: "My collection",
    description: "My cool collection",
    symbol: "PUNK",
    mode: "Nft",
    tokenPropertyPermissions: [
      {
        key: "TimestampOfLastBattle",
        permission: { mutable: true, collectionAdmin: true, tokenOwner: true },
      },
    ],
  });

  const collectionId = collection.result.collectionId;

  const tokens = await sdk.token.mintNFTs({
    collectionId,
    tokens: [
      {
        data: {
          image: "http://ipfs.io/image.png",
          name: "NFT name",
          description: "My cool nft",
          attributes: [
            {
              trait_type: "Rarity",
              value: "Epic",
            },
          ],
        },
        properties: [{ key: "TimestampOfLastBattle", value: "1000" }],
      },
    ],
  });

  console.log("Done!");
};

main();
