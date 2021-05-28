import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { useCallback } from "react";

type SignInput = {
	encryptionPassword?: string;
	mnemonic?: string;
	secondMnemonic?: string;
};
export const useWalletSignatory = (wallet: ProfileContracts.IReadWriteWallet) => {
	const sign = useCallback(
		async ({ mnemonic, secondMnemonic, encryptionPassword }: SignInput) => {
			if (encryptionPassword) {
				return wallet.signatory().wif(await wallet.wif().get(encryptionPassword));
			}

			if (!!mnemonic && !!secondMnemonic) {
				return wallet.signatory().secondaryMnemonic(mnemonic, secondMnemonic);
			}

			if (mnemonic) {
				return wallet.signatory().mnemonic(mnemonic);
			}

			if (wallet.isMultiSignature() || wallet.isLedger()) {
				return wallet.signatory().senderPublicKey(wallet.publicKey()!);
			}

			throw new Error("Signing failed. No mnemonic or encryption password provided");
		},
		[wallet],
	);
	return { sign };
};
