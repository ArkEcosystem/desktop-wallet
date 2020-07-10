import React from "react";

import { wallet, wallets } from "./data";
import { WalletDetails } from "./WalletDetails";

export default { title: "Domains / Wallet / Pages / WalletDetails" };

export const Default = () => <WalletDetails wallets={wallets} wallet={wallet} />;
