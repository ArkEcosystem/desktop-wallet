import React from "react";

import { MnemonicList } from "./MnemonicList";

export default {
	title: "Domains / Wallet / Components / MnemonicList",
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

export const Default = () => <MnemonicList mnemonic={mnemonic} />;
