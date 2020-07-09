import React from "react";

import { WalletDetails } from "./WalletDetails";

export default { title: "Domains / Wallet / Pages / WalletDetails" };

import { wallet, wallets } from "./data";

export const Default = () => <WalletDetails wallets={wallets} wallet={wallet} />;
