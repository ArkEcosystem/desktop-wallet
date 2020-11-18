import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Avatar } from "app/components/Avatar";
import { Divider } from "app/components/Divider";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

export const VoteLedgerReview = ({
	fee,
	wallet,
	votes,
	unvotes,
}: {
	fee: BigNumber;
	wallet: ReadWriteWallet;
	votes: ReadOnlyWallet[];
	unvotes: ReadOnlyWallet[];
}) => {
	const { t } = useTranslation();

	const delegate = votes[0] || unvotes[0];
	const sign = votes.length > 0 ? "+" : "-";

	return (
		<>
			<Divider />
			<div className="flex flex-col space-y-2">
				<h2 className="text-2xl font-bold">{t("TRANSACTION.TRANSACTION_DETAILS")}</h2>

				<TransactionDetail
					label={t("TRANSACTION.DELEGATE_PUBLICKEY")}
					borderPosition="bottom"
					extra={<Avatar className="ml-6" size="lg" address={delegate.address()} />}
				>
					<span className="break-all">{`${sign}${delegate.publicKey()}`}</span>
				</TransactionDetail>

				<TransactionFee currency={wallet.currency()} value={BigNumber.make(fee)} border={false} />
			</div>
		</>
	);
};
