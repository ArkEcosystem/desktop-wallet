import React from "react";
import { WalletMnemonicList } from "./WalletMnemonicList";

export default {
	title: "Wallets / Components / MnemonicList",
};

const mnemonic = [
	"lorem",
	"ipsum",
	"dolor",
	"sit",
	"amet",
	"consectetur",
	"adipisicing",
	"elit",
	"nihil",
	"nisi",
	"natus",
	"adipisci",
];

export const Default = () => <WalletMnemonicList mnemonic={mnemonic} />;
