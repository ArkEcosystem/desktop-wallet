import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { LedgerWallet } from "./";

export default { title: "Wallets / Components / Ledger Wallet" };

export const Default = () => <LedgerWallet isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
