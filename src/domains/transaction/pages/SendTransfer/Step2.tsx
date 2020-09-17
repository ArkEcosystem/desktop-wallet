import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";
import { RecipientList } from "domains/transaction/components/RecipientList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SecondStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { getValues, unregister, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [watched] = useState(() => watch());
	const fee = getValues("fee") || watched.fee;
	const recipients = getValues("recipients") || watched.recipients;
	const smartbridge = getValues("smartbridge") || watched.smartbridge;

	const coinName = wallet.coinId();

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

			<div className="grid grid-flow-row gap-2 mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								{coinName && <Icon name={coinName} width={20} height={20} />}
							</Circle>
						</div>
					}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{wallet.network().name()}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address="ABUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />}>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">Sender</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.RECIPIENTS")} className="py-6">
					<RecipientList recipients={recipients} assetSymbol="ARK" isEditable={false} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.SMARTBRIDGE")}
					className="pt-6"
					extra={
						<div className="mx-2">
							<Icon name="Smartbridge" width={32} height={32} />
						</div>
					}
				>
					{smartbridge}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox amount={amount} fee={BigNumber.make(fee)} />
				</div>
			</div>
		</section>
	);
};
