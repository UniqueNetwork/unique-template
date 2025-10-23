import { UniqueChain } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";

const image1 =
  "https://tomato-familiar-goat-954.mypinata.cloud/ipfs/bafybeieopvbqz46m7aytx6wqvvcr42slckp3anbhinias7qxn543o7szxy";
const image2 =
  "https://tomato-familiar-goat-954.mypinata.cloud/ipfs/bafybeifvtl4zo47zjqcmqiplgiwyyoh7fsezfiskxmqnxlaaleb4pin34e";

const sword =
  "https://tomato-familiar-goat-954.mypinata.cloud/ipfs/bafkreicwcok5vo3pg2kd7vm3xl6eef4fn5eujevbfdqkokzg3rcqovjbdy";
const cover =
  "https://tomato-familiar-goat-954.mypinata.cloud/ipfs/bafybeiasbvwkwqfouyyq7d2ip7alm77q3qkoj55536xvaucmojegu2dhxu";

const main = async () => {
  const account = Sr25519Account.fromUri("//Alice"); // //Bob, //Charlie

  const sdk = UniqueChain({
    baseUrl: "http://localhost:3000",
    account,
  });

  const collection = await sdk.collection.create({
    name: "Kingdoms. Card Game",
    description: "Funny Card Game",
    symbol: "KNG",
    mode: "Nft",
    info: { cover_image: { url: cover } },
    permissions: {
      nesting: {
        collectionAdmin: true,
        tokenOwner: true,
        // restricted: []
      },
    },
    tokenPropertyPermissions: [
      {
        key: "TimestampOfLastBattle",
        permission: { mutable: true, collectionAdmin: true, tokenOwner: false },
      },
      // {
      //   key: "tokenData",
      //   permission: { mutable: true, collectionAdmin: true, tokenOwner: false },
      // },
    ],
  });

  const collectionId = collection.result.collectionId;

  const tokenTx = await sdk.token.mintNFTs({
    collectionId,
    tokens: [
      {
        // Property: tokenData
        data: {
          image: image1,
          name: "Warrior",
          description: "My cool warrior",
          attributes: [
            {
              trait_type: "Rarity",
              value: "Epic",
            },
            {
              trait_type: "Number of battles",
              value: "0",
            },
          ],
          // media: {
          //   audio1: { type: "audio", url: "http://ipfs" },
          //   audio2: { type: "audio", url: "http://ipfs" },
          //   audio3: { type: "audio", url: "http://ipfs" },
          // },
          // royalties: [{ address: "5wermklw", percent: 3 }],
        },
        properties: [{ key: "TimestampOfLastBattle", value: "1000" }],
      },
      {
        data: {
          image: sword,
          name: "Sword",
          description: "My cool sword",
          attributes: [
            {
              trait_type: "Rarity",
              value: "Common",
            },
          ],
        },
      },
    ],
  });

  await sdk.token.updateNft({
    collectionId,
    tokenId: 1,
    data: {
      image: image2,
      attributes: [{ trait_type: "Number of battles", value: 1 }],
    },
  });

  /// nesting

  await sdk.token.nest({
    parent: { collectionId, tokenId: 1 },
    nested: { collectionId, tokenId: 2 },
  });

  const swordNft = await sdk.token.get({ collectionId, tokenId: 2 });

  console.log("Done!");
};

main();
