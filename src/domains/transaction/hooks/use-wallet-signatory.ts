import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { useCallback } from "react";

interface SignInput {
	encryptionPassword?: string;
	mnemonic?: string;
	secondMnemonic?: string;
	wif?: string;
	privateKey?: string;
}
export const useWalletSignatory = (wallet: ProfileContracts.IReadWriteWallet) => {
	const sign = useCallback(
		async ({ mnemonic, secondMnemonic, encryptionPassword, wif, privateKey }: SignInput) => {
			if (wif) {
				return wallet.signatory().wif(wif);
			}

			if (privateKey) {
				return wallet.signatory().privateKey(privateKey);
			}

			if (encryptionPassword) {
				return wallet.signatory().wif(await wallet.wif().get(encryptionPassword));
			}

			if (mnemonic && secondMnemonic) {
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
