export const contact1 = {
  name: () => "ROBank",
  addresses: () => [
    {
      coin: "Ark",
      network: "mainnet",
      address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
      isDelegate: () => true,
      isBusiness: () => true,
      isBridgechain: () => true,
    },
  ],
};

export const contact2 = {
  name: () => "OLEBank",
  addresses: () => [
    {
      coin: "Ark",
      network: "mainnet",
      address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
      isDelegate: () => true,
      isBusiness: () => false,
      isBridgechain: () => false,
    },
    {
      coin: "Bitcoin",
      network: "mainnet",
      address: "15pyr1HRAxpq3x64duXav1csmyCtXXu9G8",
      isDelegate: () => false,
      isBusiness: () => false,
      isBridgechain: () => false,
    },
    {
      coin: "Ethereum",
      network: "mainnet",
      address: "0x5e8f7a63e31c759ef0ad5e71594e838b380d7c33",
      isDelegate: () => false,
      isBusiness: () => true,
      isBridgechain: () => false,
    },
  ],
};

export const contacts = [
  contact1,
  contact2,
];
