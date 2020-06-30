import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { LedgerWallet } from "./LedgerWallet";

export default { title: "Wallet / Components / Ledger Wallet" };

export const Default = () => <LedgerWallet isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;
