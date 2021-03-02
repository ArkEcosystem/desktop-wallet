import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import { Image } from "app/components/Image";
import React from "react";
import { useTranslation } from "react-i18next";

import { Signatures } from "./Signatures";

export const SentStep = ({
	transaction,
	wallet,
}: {
	transaction: Contracts.SignedTransactionData;
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const participants = transaction
		.get<{ publicKeys: string[] }>("multiSignature")
		.publicKeys.filter((pubKey) => pubKey !== wallet.publicKey());

	return (
		<section>
			<Header title={t("TRANSACTION.SUCCESS.TITLE")} />

			<Image name="TransactionSuccessBanner" domain="transaction" className="my-4 w-full" />

			<p className="text-theme-secondary-700">
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.STEP_3.DESCRIPTION")}
			</p>

			<div className="mt-4">
				<Signatures publicKeys={participants} transactionId={transaction.id()} wallet={wallet} />
			</div>
		</section>
	);
};
