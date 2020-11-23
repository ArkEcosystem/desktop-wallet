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

			<Image name="TransactionSuccessfulBanner" domain="transaction" className="w-full my-4" />

			<p className="text-theme-neutral-dark">{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.STEP_3.DESCRIPTION")}</p>

			<div className="mt-4">
				<Signatures publicKeys={participants} transactionId={transaction.id()} wallet={wallet} />
			</div>
		</section>
	);
};
