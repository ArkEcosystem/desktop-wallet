import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { RecipientList } from "../RecipientList";
import { TotalAmountBox } from "../TotalAmountBox";
import { Participant } from "./components/AddParticipant/AddParticipant";

export const ReviewStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { unregister, watch } = useFormContext();
	const { fee, participants, minParticipants } = watch();

	useEffect(() => {
		unregister("mnemonic");
	}, [unregister]);

	return (
		<section data-testid="MultiSignature__review-step">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_MULTISIGNATURE.REVIEW_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">
				{t("TRANSACTION.PAGE_MULTISIGNATURE.REVIEW_STEP.DESCRIPTION")}
			</div>

			<div className="grid grid-flow-row gap-2 mt-4">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.CRYPTOASSET")}
					extra={<NetworkIcon coin={wallet.coinId()} network={wallet.networkId()} />}
				>
					<div className="flex-auto font-semibold truncate text-md text-theme-neutral-800 max-w-24">
						{wallet.network().name()}
					</div>
				</TransactionDetail>

				<TransactionDetail extra={<Avatar size="lg" address={wallet.address()} />}>
					<div className="mb-2 font-semibold text-theme-neutral">
						<span className="mr-1 text-sm">{t("TRANSACTION.SENDER")}</span>
						<Label color="warning">
							<span className="text-sm">{t("TRANSACTION.YOUR_ADDRESS")}</span>
						</Label>
					</div>
					<Address address={wallet.address()} walletName={wallet.alias()} />
				</TransactionDetail>

				<TransactionDetail border={false} label={t("TRANSACTION.MULTISIGNATURE.PARTICIPANTS")}>
					<RecipientList
						showAmount={false}
						variant="condensed"
						recipients={participants.map((item: Participant) => ({
							...item,
							amount: BigNumber.make(item.balance),
						}))}
						assetSymbol={wallet.network().ticker()}
						isEditable={false}
					/>
				</TransactionDetail>

				<TransactionDetail label={t("TRANSACTION.MULTISIGNATURE.MIN_SIGNATURES")}>
					<div className="flex items-center space-x-1 font-semibold">
						<span>{minParticipants}</span>
						<span className="text-theme-neutral">
							{t("TRANSACTION.MULTISIGNATURE.OUT_OF_LENGTH", { length: participants.length })}
						</span>
					</div>
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.TYPE")}
					extra={
						<div>
							<Circle className="border-black bg-theme-background" size="lg">
								<Icon name="Multisig" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					{t("TRANSACTION.PAGE_MULTISIGNATURE.REVIEW_STEP.TYPE")}
				</TransactionDetail>

				<div className="mt-2">
					<TotalAmountBox amount={BigNumber.ZERO} fee={BigNumber.make(fee)} ticker={wallet.currency()} />
				</div>
			</div>
		</section>
	);
};
