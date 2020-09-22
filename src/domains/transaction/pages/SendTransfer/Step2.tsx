import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ReviewStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [watched] = useState(() => watch());
	const fee = getValues("fee") || watched.fee;
	const recipients = getValues("recipients") || watched.recipients;
	const smartbridge = getValues("smartbridge") || watched.smartbridge;

	let amount = BigNumber.ZERO;
	for (const recipient of recipients) {
		amount = amount.plus(recipient.amount);
	}

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="SendTransfer__step--second">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.DESCRIPTION")}
				</div>
			</div>

			<TransactionDetail
				border={false}
				label={t("TRANSACTION.NETWORK")}
				extra={<NetworkIcon size="lg" coin={wallet.network().coin()} network={wallet.network().id()} />}
			>
				{wallet.network().name()}
			</TransactionDetail>

			<TransactionDetail extra={<Avatar size="lg" address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
				<div className="flex-1 space-y-2">
					<div className="text-theme-neutral">
						<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.RECIPIENTS")} className="py-6">
				<RecipientList recipients={recipients} assetSymbol={wallet.currency()} isEditable={false} />
			</TransactionDetail>

			{smartbridge && (
				<TransactionDetail
					label={t("TRANSACTION.SMARTBRIDGE")}
					extra={
						<div className="flex justify-center w-11">
							<Icon name="Smartbridge" width={18} height={22} />
						</div>
					}
				>
					<p className="break-all">{smartbridge}</p>
				</TransactionDetail>
			)}

			<div className="mt-2">
				<TotalAmountBox amount={amount} fee={BigNumber.make(fee)} />
			</div>
		</section>
	);
};
